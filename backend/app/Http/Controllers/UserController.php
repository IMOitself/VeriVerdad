<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
	public function index(Request $request)
	{
		$sectionId = $request->query('section_id');

		$query = User::with(['section', 'badges'])->withCount('veribots');

		if ($sectionId) {
			$query->where('section_id', $sectionId);
		}

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

		$user->load(['section', 'badges'])->loadCount('veribots');

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
			'first_name'       => 'sometimes|string|max:100',
			'last_name'        => 'sometimes|string|max:100',
			'section_id'       => 'nullable|exists:sections,id',
			'tokens_allocated' => 'sometimes|integer|min:0',
		]);

		$user->update($request->only(['first_name', 'last_name', 'section_id', 'tokens_allocated']));

		return response()->json([
			'success' => true,
			'data'    => $user->load(['section', 'badges'])->loadCount('veribots'),
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
