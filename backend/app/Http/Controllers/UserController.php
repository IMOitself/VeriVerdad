<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$users = \App\Models\User::all();
		return response()->json(['data' => $users], 200);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
			//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
			//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
			//
	}
	
	public function showProfile(Request $request)
	{
		return response()->json([
			'data' => $request->user()
		], 200);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(string $id)
	{
			//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		$user = \App\Models\User::find($id);
		if (!$user) {
			return response()->json(['message' => 'User not found'], 404);
		}

		$validated = $request->validate([
			'username' => 'sometimes|string|min:3|max:30|unique:users,username,' . $user->id,
			'email' => 'sometimes|email|max:254|unique:users,email,' . $user->id,
			'role' => 'sometimes|in:student,teacher,admin',
		]);

		$user->update($validated);

		return response()->json(['data' => $user], 200);
	}
	
	public function updateProfile(Request $request)
	{
		$user = $request->user();
		
		$rules = [
			'username' => 'sometimes|string|min:3|max:30|unique:users,username,' . $user->id,
			'email' => 'sometimes|email|max:254|unique:users,email,' . $user->id,
			'new_password' => 'sometimes|string|min:8|confirmed',
		];

		if ($user->role === 'admin') {
			$rules['role'] = 'sometimes|in:student,teacher,admin';
		}

		$validated = $request->validate($rules);
		
		if (isset($validated['new_password'])) {
			$validated['password'] = $validated['new_password'];
		}
		
		unset($validated['new_password']);
		
		$user->update($validated);
		
		return response()->json([
			'data' => $user
		], 200);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		$user = \App\Models\User::find($id);
		if (!$user) {
			return response()->json(['message' => 'User not found'], 404);
		}
		$user->delete();
		return response()->json(['message' => 'User deleted successfully'], 200);
	}
}
