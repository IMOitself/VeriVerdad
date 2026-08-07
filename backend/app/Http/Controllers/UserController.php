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
			//
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
			//
	}
	
	public function updateProfile(Request $request)
	{
		$user = $request->user();
		
		$validated = $request->validate([
			'username' => 'sometimes|string|min:3|max:30|unique:users,username,' . $user->id,
			'email' => 'sometimes|email|max:254|unique:users,email,' . $user->id,
			'new_password' => 'sometimes|string|min:8|confirmed',
		]);
		
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
			//
	}
}
