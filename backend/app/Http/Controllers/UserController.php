<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$authUser = $request->user();
		if (!$authUser || !in_array($authUser->role, ['admin', 'teacher'])) {
			return response()->json(['message' => 'Unauthorized action.'], 403);
		}

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
		$user = $this->findOrFail404(\App\Models\User::class, $id, 'User');
		if ($user instanceof \Illuminate\Http\JsonResponse) {
			return $user;
		}

		$authUser = $request->user();
		$isAdmin = $authUser && $authUser->role === 'admin';
		$isSelfWithoutRole = $authUser && (int)$authUser->id === (int)$id && !$request->has('role');

		$keys = $request->except(['section_id']);
		$isTeacherUpdatingStudentSection = $authUser && $authUser->role === 'teacher' 
			&& $user->role === 'student' 
			&& $request->has('section_id')
			&& empty($keys);

		if (!$isAdmin && !$isSelfWithoutRole && !$isTeacherUpdatingStudentSection) {
			return response()->json(['message' => 'Unauthorized action.'], 403);
		}

		$validated = $request->validate([
			'username' => 'sometimes|string|min:3|max:30|unique:users,username,' . $user->id,
			'email' => 'sometimes|email|max:254|unique:users,email,' . $user->id,
			'role' => 'sometimes|in:student,teacher,admin',
			'section_id' => 'sometimes|nullable|exists:sections,id',
			'new_password' => 'sometimes|nullable|string|min:8|confirmed',
		]);

		$validated = $this->applyPasswordChange($validated);

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
		
		$validated = $this->applyPasswordChange($validated);
		
		$user->update($validated);
		
		return response()->json([
			'data' => $user
		], 200);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Request $request, string $id)
	{
		$authUser = $request->user();
		if (!$authUser || $authUser->role !== 'admin') {
			return response()->json(['message' => 'Unauthorized action.'], 403);
		}

		$user = $this->findOrFail404(\App\Models\User::class, $id, 'User');
		if ($user instanceof \Illuminate\Http\JsonResponse) {
			return $user;
		}
		$user->delete();
		return response()->json(['message' => 'User deleted successfully'], 200);
	}

	private function applyPasswordChange(array $validated): array
	{
		if (!empty($validated['new_password'])) {
			$validated['password'] = $validated['new_password'];
		}

		unset($validated['new_password']);

		return $validated;
	}
}
