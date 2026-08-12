<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;

class ChatService
{
	public function sendMessage($userId, $conversationId, $content)
	{
		if ($conversationId) {
			$conversation = Conversation::where('user_id', $userId)->findOrFail($conversationId);
		} else {
			$conversation = Conversation::create(['user_id' => $userId]);
		}

		if (is_null($conversation->title)) {
			$groq = app(GroqService::class);
			$titleResult = $groq->chat([
				['role' => 'system', 'content' => 'Summarize the user message into a short 3 to 5 word title. Reply with only the title, no punctuation.'],
				['role' => 'user', 'content' => $content],
			]);
			$conversation->update(['title' => $titleResult['reply']]);
		}

		$history = Message::where('conversation_id', $conversation->id)
			->orderByDesc('created_at')
			->limit(20)
			->get()
			->reverse()
			->values();

		$systemPrompt = <<<'PROMPT'
You are a helpful assistant.
PROMPT;

		$groqMessages = array_map(function ($msg) {
			return ['role' => $msg->role, 'content' => $msg->content];
		}, $history->all());

		array_unshift($groqMessages, ['role' => 'system', 'content' => $systemPrompt]);
		$groqMessages[] = ['role' => 'user', 'content' => $content];

		$groq = app(GroqService::class);
		$result = $groq->chat($groqMessages);

		Message::create([
			'conversation_id' => $conversation->id,
			'role' => 'user',
			'content' => $content,
		]);

		Message::create([
			'conversation_id' => $conversation->id,
			'role' => 'assistant',
			'content' => $result['reply'],
			'reasoning' => $result['reasoning'],
		]);

		return [
			'conversation' => $conversation,
			'reply' => $result['reply'],
			'reasoning' => $result['reasoning'],
			'model' => $result['model'],
			'usage' => $result['usage'],
		];
	}

	public function getUserConversations($userId)
	{
		return Conversation::where('user_id', $userId)->latest()->get();
	}

	public function getConversation($id, $userId)
	{
		return Conversation::where('user_id', $userId)->with('messages')->findOrFail($id);
	}

	public function deleteConversation($id, $userId)
	{
		$conversation = Conversation::where('user_id', $userId)->findOrFail($id);
		$conversation->delete();
	}
}
