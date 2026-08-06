<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Veribot;
use Illuminate\Http\Request;
use Gemini\Data\Content;

class VeribotController extends Controller
{
	protected AIController $aiController;

	public function __construct(AIController $aiController)
	{
		$this->aiController = $aiController;
	}

	private function getSystemInstruction(string $currentDate, string $currentYear): Content
	{
		$promptPath = resource_path('prompts/Veribot.md');
		$masterPrompt = file_exists($promptPath) ? file_get_contents($promptPath) : '';

		return Content::parse("{$masterPrompt}\n\n## Dynamic Date Context\nToday is {$currentDate} ({$currentYear}). Always evaluate news, weather, and claims relative to this current date and year. Sources published before the claim date CANNOT verify it.");
	}

	public function analyze(Request $request)
	{
		$request->validate([
			'input_query' => 'required|string|min:2',
		]);

		$inputQuery = trim($request->input('input_query'));
		$user = $request->user();

		try {
			$currentDate = date('F j, Y');
			$currentYear = date('Y');

			$systemInstruction = $this->getSystemInstruction($currentDate, $currentYear);
			$prompt = "Current Date: {$currentDate}. Verify and analyze this news headline or link: {$inputQuery}";

			$aiResult = $this->aiController->processAI($prompt, $systemInstruction, $inputQuery);

			if (!$aiResult) {
				return response()->json([
					'success' => false,
					'message' => 'VeriBot AI is currently busy or rate-limited. Please retry in a few moments.',
				], 503);
			}

			$userId = $user?->id ?? User::value('id') ?? 1;

			$veribot = Veribot::create([
				'user_id'       => $userId,
				'input_query'   => $inputQuery,
				'quiz_score'    => 0,
				'bias_detected' => $aiResult['bias_detected'] ?? false,
				'details'       => json_encode($aiResult),
			]);

			return response()->json([
				'success'    => true,
				'veribot_id' => $veribot->id,
				'analysis'   => $aiResult,
			], 200);

		} catch (\Throwable) {
			return response()->json([
				'success' => false,
				'message' => 'VeriBot AI analysis failed.',
			], 500);
		}
	}

	public function submitQuiz(Request $request)
	{
		$request->validate([
			'veribot_id' => 'required|exists:veribots,id',
			'answers'    => 'required|array',
		]);

		$veribot = Veribot::findOrFail($request->input('veribot_id'));
		$userAnswers = $request->input('answers');
		$details = json_decode($veribot->details, true);

		$questions = $details['questions'] ?? [];
		$totalQuestions = count($questions);
		$correctCount = 0;

		foreach ($questions as $index => $question) {
			if (isset($userAnswers[$index]) && (int)$userAnswers[$index] === (int)$question['correct_index']) {
				$correctCount++;
			}
		}

		$score = $totalQuestions > 0 ? (int)round(($correctCount / $totalQuestions) * 100) : 100;

		$veribot->update([
			'quiz_score' => $score,
		]);

		$newBadges = BadgeController::evaluateBadges($veribot->user_id);

		return response()->json([
			'success'       => true,
			'veribot_id'    => $veribot->id,
			'quiz_score'    => $score,
			'correct_count' => $correctCount,
			'total'         => $totalQuestions,
			'details'       => $details,
			'new_badges'    => $newBadges,
		]);
	}

	public function history(Request $request)
	{
		$userId = $request->user()?->id ?? User::value('id') ?? 1;

		$history = Veribot::where('user_id', $userId)
			->latest()
			->limit(50)
			->get()
			->map(function ($item) {
				$item->details = json_decode($item->details, true);
				return $item;
			});

		return response()->json([
			'success' => true,
			'data'    => $history,
		]);
	}

	public function index(Request $request)
	{
		$query = Veribot::with('user:id,username,email')->latest();

		$items = $query->limit(100)->get()->map(function ($item) {
			$item->details = json_decode($item->details, true);
			return $item;
		});

		return response()->json([
			'success' => true,
			'data'    => $items,
		]);
	}

	public function show($id)
	{
		$veribot = Veribot::with('user:id,username,email')->findOrFail($id);
		$veribot->details = json_decode($veribot->details, true);

		return response()->json([
			'success' => true,
			'data'    => $veribot,
		]);
	}

	public function destroy($id)
	{
		$veribot = Veribot::findOrFail($id);
		$veribot->delete();

		return response()->json([
			'success' => true,
			'message' => 'Verification history record deleted successfully.',
		]);
	}
}