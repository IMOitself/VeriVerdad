<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatRequest extends FormRequest
{
	public function authorize()
	{
		return true;
	}

	public function rules()
	{
		return [
			'message' => 'required|string|max:4000',
			'conversation_id' => 'nullable|string|uuid|exists:conversations,id',
		];
	}
}
