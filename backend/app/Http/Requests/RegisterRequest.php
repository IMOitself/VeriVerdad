<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
	public function authorize()
	{
		return true;
	}

	public function rules()
	{
		return [
			'username' => 'required|string|min:3|max:30|unique:users',
			'email' => 'required|email|max:254|unique:users',
			'password' => 'required|string|min:8',
		];
	}
}
