<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
	public function register(RegisterRequest $request)
	{
		$validated = $request->validated();

		$user = User::create($validated);
		$token = $user->createToken('auth-token');

		return response()->json([
			'user' => $user,
			'token' => $token->plainTextToken,
		],201);
	}

	public function login(LoginRequest $request)
	{
		$validated = $request->validated();

		$user = User::where('email', $validated['email'])->first();

		if (! $user || ! Hash::check($validated['password'], $user->password)) {
			return response()->json([
				'message' => 'Incorrect email or password.'
			], 401);
		}

		$token = $user->createToken('auth-token');

		return response()->json([
			'user' => $user,
			'token' => $token->plainTextToken,
		]);
	}

	public function logout(Request $request)
	{
		$request->user()->currentAccessToken()->delete();

		return response()->noContent();
	}
}