<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
	public function register(RegisterRequest $request)
	{
		return $this->success([
			'user' => $user = User::create($request->validated()),
			'token' => $user->createToken('auth-token')->plainTextToken
		]);
	}

	public function login(LoginRequest $request)
	{
		$user = User::where('email', $request->email)->first();

		if (! $user || ! Hash::check($request->password, $user->password)) {
			return $this->error('Incorrect email or password.', 401);
		}

		return $this->success([
			'user' => $user,
			'token' => $user->createToken('auth-token')->plainTextToken
		]);
	}

	public function logout()
	{
		request()->user()->currentAccessToken()->delete();

		return response()->noContent();
	}
}
