<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;

class ChatService
{
	public function sendMessage($userId, $conversationId, $content, $messageId = null)
	{
		$conversation = $conversationId ? Conversation::where('user_id', $userId)->findOrFail($conversationId) : Conversation::create(['user_id' => $userId]);

		if ($messageId) {
			$target = Message::where('conversation_id', $conversation->id)->findOrFail($messageId);
			Message::where('conversation_id', $conversation->id)->where('created_at', '>=', $target->created_at)->delete();
			Message::where('conversation_id', $conversation->id)->count() === 0 && $conversation->update(['title' => null]);
		}

		if (is_null($conversation->title)) {
			$titleResult = app(GroqService::class)->chat([
				['role' => 'system', 'content' => 'Summarize the user message into a short 3 to 5 word title. Reply with only the title, no punctuation.'],
				['role' => 'user', 'content' => $content]
			]);
			$conversation->update(['title' => $titleResult['reply']]);
		}

		$history = Message::where('conversation_id', $conversation->id)->orderByDesc('created_at')->limit(20)->get()->reverse()->values();

		$result = app(GroqService::class)->chat(array_merge(
			[['role' => 'system', 'content' => 'You are a helpful assistant.']],
			$history->map(fn($msg) => ['role' => $msg->role, 'content' => $msg->content])->all(),
			[['role' => 'user', 'content' => $content]]
		));

		Message::create(['conversation_id' => $conversation->id, 'role' => 'user', 'content' => $content]);
		Message::create(['conversation_id' => $conversation->id, 'role' => 'assistant', 'content' => $result['reply'], 'reasoning' => $result['reasoning']]);

		return [
			'conversation' => $conversation,
			'reply' => $result['reply'],
			'reasoning' => $result['reasoning'],
			'model' => $result['model'],
			'usage' => $result['usage']
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

	public function updateConversation($id, $userId, $title)
	{
		return tap(Conversation::where('user_id', $userId)->findOrFail($id))->update(['title' => $title]);
	}

	public function deleteConversation($id, $userId)
	{
		Conversation::where('user_id', $userId)->findOrFail($id)->delete();
	}
}
