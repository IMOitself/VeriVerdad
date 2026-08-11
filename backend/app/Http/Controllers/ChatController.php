<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatRequest;
use App\Services\ChatService;

class ChatController extends Controller
{
	public function chat(ChatRequest $request, ChatService $chat)
	{
		try {
			$result = $chat->sendMessage(
				auth()->id(),
				$request->validated('conversation_id'),
				$request->message
			);

			return response()->json([
				'conversation_id' => $result['conversation']->id,
				'reply' => $result['reply'],
				'reasoning' => $result['reasoning'],
				'model' => $result['model'],
				'usage' => $result['usage'],
			]);
		} catch (\RuntimeException $e) {
			return response()->json(['message' => $e->getMessage()], 503);
		}
	}

	public function index(ChatService $chat)
	{
		$conversations = $chat->getUserConversations(auth()->id());

		return $this->success($conversations);
	}

	public function show($id, ChatService $chat)
	{
		return $this->success($chat->getConversation($id, auth()->id()));
	}

	public function destroy($id, ChatService $chat)
	{
		$chat->deleteConversation($id, auth()->id());

		return response()->noContent();
	}
}
