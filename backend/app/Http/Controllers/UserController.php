<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
	public function index(Request $request)
	{
		$query = User::with(['badges'])->withCount('veribots');

		return response()->json([
			'success' => true,
			'data'    => $query->get(),
		]);
	}

	public function show(Request $request, ?int $id = null)
	{
		$user = $id ? User::find($id) : $request->user();

		if (! $user) {
			return response()->json(['message' => 'User not found.'], 404);
		}

		$user->load(['badges'])->loadCount('veribots');

		return response()->json([
			'success' => true,
			'data'    => $user,
		]);
	}

	public function update(Request $request, ?int $id = null)
	{
		$user = $id ? User::find($id) : $request->user();

		if (! $user) {
			return response()->json(['message' => 'User not found.'], 404);
		}

		$request->validate([
			'username' => 'sometimes|string|max:100',
		]);

		$user->update($request->only(['username']));

		return response()->json([
			'success' => true,
			'data'    => $user->load(['badges'])->loadCount('veribots'),
		]);
	}

	public function destroy(int $id)
	{
		$user = User::findOrFail($id);
		$user->delete();

		return response()->json([
			'success' => true,
			'message' => 'User deleted successfully.',
		]);
	}
}
