<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Gemini\Data\Content;
use Gemini\Data\GoogleSearch;
use Gemini\Data\Tool;

class AIController extends Controller
{
	private const REQUIRED_FIELDS = ['summary', 'ground_truth_verdict'];

	public function processAI(string $prompt, ?Content $systemInstruction = null, string $searchQuery = ''): ?array
	{
		$cleanedQuery = $this->cleanSearchQuery($searchQuery ?: $prompt);
		$tavily = $this->searchTavily($cleanedQuery);

		$todayStr = date('F j, Y');
		$todayDate = date('Y-m-d');

		$enrichedPrompt = $tavily['context']
			? "TODAY'S CURRENT DATE: {$todayStr} ({$todayDate})\n\nREAL-TIME WEB SEARCH RESULTS:\n{$tavily['context']}\n\nIMPORTANT VERIFICATION INSTRUCTION: Always compare the publication date of evidence against the claim date. Sources published before the claim date or marked [OUTDATED] cannot verify current claims.\n\n{$prompt}"
			: "TODAY'S CURRENT DATE: {$todayStr} ({$todayDate})\n\n{$prompt}";

		return $this->processGemini($enrichedPrompt, $systemInstruction, $tavily['sources'])
			?? $this->processGroq($enrichedPrompt, $systemInstruction, $cleanedQuery, $tavily['sources']);
	}

	public function cleanSearchQuery(string $query): string
	{
		$trimmed = trim($query);

		if (filter_var($trimmed, FILTER_VALIDATE_URL)) {
			$parsedUrl = parse_url($trimmed);
			$cleanUrl = ($parsedUrl['scheme'] ?? 'https') . '://' . ($parsedUrl['host'] ?? '') . ($parsedUrl['path'] ?? '');
			return substr($cleanUrl, 0, 300);
		}

		return substr($trimmed, 0, 300);
	}

	public function searchTavily(string $query): array
	{
		$keys = config('tavily.api_keys', []);
		$keyCount = count($keys);

		if ($keyCount === 0) return ['context' => null, 'sources' => []];

		$startIndex = Cache::increment('ai_tavily_key_index') % $keyCount;

		for ($i = 0; $i < $keyCount; $i++) {
			$keyIndex = ($startIndex + $i) % $keyCount;

			try {
				$response = Http::timeout(config('tavily.request_timeout', 15))
					->post(config('tavily.base_url', 'https://api.tavily.com') . '/search', [
						'api_key'                => $keys[$keyIndex],
						'query'                  => substr($query, 0, 400),
						'max_results'            => config('tavily.max_results', 5),
						'search_depth'           => 'basic',
						'include_published_date' => true,
					]);

				if ($response->successful()) {
					$results = $response->json('results', []);

					if (!empty($results)) {
						$nowTs = time();
						$currentMonth = date('Y-m');

						$context = collect($results)->map(function ($r) use ($currentMonth) {
							$published = $r['published_date'] ?? null;
							$dateLabel = '[Date: unknown]';

							if ($published) {
								$ts = strtotime($published);
								if ($ts !== false) {
									$pubMonth = date('Y-m', $ts);
									$dateLabel = $pubMonth >= $currentMonth
										? '[RECENT: ' . date('Y-m-d', $ts) . ']'
										: '[OUTDATED: ' . date('Y-m-d', $ts) . ']';
								}
							}

							return "Source: {$r['title']} {$dateLabel}\nURL: {$r['url']}\nContent: " . substr($r['content'] ?? '', 0, 350);
						})->implode("\n\n");

						$sources = collect($results)->map(function ($r) {
							$published = $r['published_date'] ?? null;
							$ts = $published ? strtotime($published) : false;
							return [
								'title'          => $r['title'],
								'url'            => $r['url'],
								'published_date' => $ts ? date('Y-m-d', $ts) : null,
							];
						})->values()->toArray();

						return ['context' => $context, 'sources' => $sources];
					}
				}
			} catch (\Throwable) {
				usleep(100000);
				continue;
			}
		}

		return ['context' => null, 'sources' => []];
	}

	public function extractAndNormalizeJson(string $rawText, array $fallbackSources = []): ?array
	{
		if (!preg_match('/\{[\s\S]*\}/', $rawText, $matches)) {
			return null;
		}

		$jsonCandidate = trim($matches[0]);
		$parsed = json_decode($jsonCandidate, true);

		if (!is_array($parsed) || empty($parsed)) {
			return null;
		}

		foreach (self::REQUIRED_FIELDS as $field) {
			if (!array_key_exists($field, $parsed)) return null;
		}

		$requiresCaption = filter_var($parsed['requires_caption_text'] ?? false, FILTER_VALIDATE_BOOLEAN);
		$rawQuestions = $parsed['questions'] ?? [];

		$normalizedQuestions = [];
		if (is_array($rawQuestions) && count($rawQuestions) > 0) {
			foreach ($rawQuestions as $q) {
				if (!isset($q['question'], $q['options'], $q['correct_index'])) {
					continue;
				}

				$options = is_array($q['options']) ? array_values($q['options']) : [];
				if (count($options) !== 4) {
					continue;
				}

				$cleanOptions = array_map(function ($opt) {
					return trim(preg_replace('/^[A-Da-d0-9][\.\)\:\-]\s*/', '', (string)$opt));
				}, $options);

				$correctIndex = $q['correct_index'];
				if (is_string($correctIndex)) {
					$upper = strtoupper(trim($correctIndex));
					$map = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3];
					$correctIndex = $map[$upper] ?? (is_numeric($correctIndex) ? (int)$correctIndex : 0);
				}
				$correctIndex = max(0, min(3, (int)$correctIndex));

				$pillar = trim((string)($q['pillar'] ?? 'General'));

				$normalizedQuestions[] = [
					'pillar'        => $pillar,
					'question'      => trim((string)$q['question']),
					'options'       => $cleanOptions,
					'correct_index' => $correctIndex,
					'explanation'   => trim((string)($q['explanation'] ?? '')),
				];
			}
		}

		if (count($normalizedQuestions) !== 5 && !$requiresCaption) {
			return null;
		}

		$verdict = strtolower(trim((string)$parsed['ground_truth_verdict']));
		if (!in_array($verdict, ['verified', 'unverified', 'misleading', 'false', 'needs_context'])) {
			$verdict = 'unverified';
		}

		$rawSources = $parsed['sources'] ?? [];
		$normalizedSources = [];
		if (is_array($rawSources) && count($rawSources) > 0) {
			foreach ($rawSources as $s) {
				if (is_array($s) && !empty($s['url'])) {
					$normalizedSources[] = [
						'title'          => trim((string)($s['title'] ?? 'Source')),
						'url'            => trim((string)$s['url']),
						'published_date' => $s['published_date'] ?? null,
					];
				}
			}
		}

		if (empty($normalizedSources)) {
			$normalizedSources = $fallbackSources;
		}

		return [
			'summary'               => trim((string)$parsed['summary']),
			'bias_detected'         => filter_var($parsed['bias_detected'] ?? false, FILTER_VALIDATE_BOOLEAN),
			'bias_explanation'      => trim((string)($parsed['bias_explanation'] ?? '')),
			'ground_truth_verdict'  => $verdict,
			'requires_caption_text' => $requiresCaption,
			'questions'             => $normalizedQuestions,
			'sources'               => $normalizedSources,
		];
	}

	public function processGemini(string $prompt, ?Content $systemInstruction = null, array $tavilySources = []): ?array
	{
		$keys = config('gemini.api_keys', []);
		$keyCount = count($keys);

		if ($keyCount === 0) return null;

		$startIndex = Cache::increment('ai_gemini_key_index') % $keyCount;

		$models = [
			'gemini-2.0-flash',
			'gemini-2.0-flash-lite',
			'gemini-flash-latest',
		];

		for ($i = 0; $i < $keyCount; $i++) {
			$keyIndex = ($startIndex + $i) % $keyCount;
			$apiKey = $keys[$keyIndex];

			foreach ($models as $modelName) {
				try {
					$client = \Gemini::factory()->withApiKey($apiKey)->make();

					$generativeModel = $client->generativeModel(model: $modelName)
						->withTool(new Tool(googleSearch: GoogleSearch::from()));

					if ($systemInstruction !== null) {
						$generativeModel->withSystemInstruction($systemInstruction);
					}

					$response = $generativeModel->generateContent($prompt);
					$rawText = $response->text();

					$groundingSources = [];
					foreach ($response->candidates[0]->groundingMetadata?->groundingChunks ?? [] as $chunk) {
						if ($chunk->web !== null) {
							$groundingSources[] = ['title' => $chunk->web->title, 'url' => $chunk->web->uri];
						}
					}

					$effectiveSources = !empty($groundingSources) ? $groundingSources : $tavilySources;
					$normalized = $this->extractAndNormalizeJson($rawText, $effectiveSources);

					if ($normalized !== null) {
						return $normalized;
					}
				} catch (\Throwable) {
					usleep(100000);
					continue;
				}
			}
		}

		return null;
	}

	public function processGroq(string $prompt, ?Content $systemInstruction = null, string $searchQuery = '', array $tavilySources = []): ?array
	{
		$keys = config('groq.api_keys', []);
		$keyCount = count($keys);

		if ($keyCount === 0) return null;

		$startIndex = Cache::increment('ai_groq_key_index') % $keyCount;

		$models = [
			config('groq.default_model', 'llama-3.3-70b-versatile'),
			'llama-3.1-8b-instant',
		];

		$systemText = $systemInstruction?->parts[0]->text
			?? (file_exists(resource_path('prompts/Veribot.md')) ? file_get_contents(resource_path('prompts/Veribot.md')) : '');

		$baseUrl = config('groq.base_url', 'https://api.groq.com/openai/v1');
		$timeout = config('groq.request_timeout', 30);

		$fallbackSources = !empty($tavilySources) ? $tavilySources : [[
			'title' => 'Cross-reference via Google Search',
			'url'   => 'https://www.google.com/search?q=' . urlencode(substr($searchQuery, 0, 150)),
		]];

		for ($i = 0; $i < $keyCount; $i++) {
			$keyIndex = ($startIndex + $i) % $keyCount;
			$groqKey = $keys[$keyIndex];

			foreach ($models as $modelName) {
				try {
					$response = Http::withHeaders([
						'Authorization' => "Bearer {$groqKey}",
						'User-Agent'    => 'Mozilla/5.0',
					])->timeout($timeout)->post("{$baseUrl}/chat/completions", [
						'model' => $modelName,
						'messages' => [
							['role' => 'system', 'content' => $systemText],
							['role' => 'user',   'content' => $prompt],
						],
						'response_format' => ['type' => 'json_object'],
					]);

					if ($response->successful()) {
						$content = $response->json('choices.0.message.content');
						if ($content !== null) {
							$normalized = $this->extractAndNormalizeJson($content, $fallbackSources);
							if ($normalized !== null) {
								return $normalized;
							}
						}
					}
				} catch (\Throwable) {
					usleep(100000);
					continue;
				}
			}
		}

		return null;
	}
}
