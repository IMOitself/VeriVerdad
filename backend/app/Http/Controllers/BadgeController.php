<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\User;
use App\Models\Veribot;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
	public function index(Request $request)
	{
		$userId = $request->user()?->id ?? User::value('id') ?? 1;
		$user = User::find($userId);

		$userBadgeIds = $user ? $user->badges()->pluck('badges.id')->toArray() : [];

		$badges = Badge::all()->map(function ($badge) use ($userBadgeIds) {
			$badge->unlocked = in_array($badge->id, $userBadgeIds);
			return $badge;
		});

		return response()->json([
			'success' => true,
			'data'    => $badges,
		]);
	}

	public function store(Request $request)
	{
		$authUser = $request->user();
		if (!$authUser || $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$request->validate([
			'name'        => 'required|string|unique:badges,name|max:100',
			'description' => 'required|string',
			'icon'        => 'required|string|max:100',
		]);

		$badge = Badge::create($request->only(['name', 'description', 'icon']));

		return response()->json([
			'success' => true,
			'data'    => $badge,
		], 201);
	}

	public function show(int $id)
	{
		$badge = Badge::with('users:id,username,email')->findOrFail($id);

		return response()->json([
			'success' => true,
			'data'    => $badge,
		]);
	}

	public function update(Request $request, int $id)
	{
		$authUser = $request->user();
		if (!$authUser || $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$badge = Badge::findOrFail($id);

		$request->validate([
			'name'        => 'sometimes|string|max:100|unique:badges,name,' . $badge->id,
			'description' => 'sometimes|string',
			'icon'        => 'sometimes|string|max:100',
		]);

		$badge->update($request->only(['name', 'description', 'icon']));

		return response()->json([
			'success' => true,
			'data'    => $badge,
		]);
	}

	public function destroy(Request $request, int $id)
	{
		$authUser = $request->user();
		if (!$authUser || $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$badge = Badge::findOrFail($id);
		$badge->delete();

		return response()->json([
			'success' => true,
			'message' => 'Badge deleted successfully.',
		]);
	}

	public function attachUser(Request $request, int $id)
	{
		$authUser = $request->user();
		if (!$authUser || $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$request->validate([
			'user_id' => 'required|exists:users,id',
		]);

		$badge = Badge::findOrFail($id);
		$userId = $request->input('user_id');

		$badge->users()->syncWithoutDetaching([$userId]);

		return response()->json([
			'success' => true,
			'message' => "Badge {$badge->name} awarded to user.",
			'data'    => $badge->load('users'),
		]);
	}

	public function detachUser(Request $request, int $id)
	{
		$authUser = $request->user();
		if (!$authUser || $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$request->validate([
			'user_id' => 'required|exists:users,id',
		]);

		$badge = Badge::findOrFail($id);
		$userId = $request->input('user_id');

		$badge->users()->detach($userId);

		return response()->json([
			'success' => true,
			'message' => "Badge {$badge->name} removed from user.",
		]);
	}

	public static function evaluateBadges(int $userId): array
	{
		$user = User::find($userId);
		if (!$user) return [];

		$unlockedBadgeIds = $user->badges()->pluck('badges.id')->toArray();
		$newlyAwarded = [];

		$veribotCount = Veribot::where('user_id', $userId)->count();
		$hasPerfectScore = Veribot::where('user_id', $userId)->where('quiz_score', 100)->exists();
		$hasIdentifiedBias = Veribot::where('user_id', $userId)->where('bias_detected', true)->exists();

		// Pillar 1: Currency (Awarded on first verification check)
		$currency = Badge::where('name', 'Currency')->first();
		if ($currency && !in_array($currency->id, $unlockedBadgeIds) && $veribotCount >= 1) {
			$user->badges()->attach($currency->id);
			$newlyAwarded[] = $currency;
		}

		// Pillar 2: Relevance (Awarded after 2 completed quizzes)
		$relevance = Badge::where('name', 'Relevance')->first();
		if ($relevance && !in_array($relevance->id, $unlockedBadgeIds) && $veribotCount >= 2) {
			$user->badges()->attach($relevance->id);
			$newlyAwarded[] = $relevance;
		}

		// Pillar 3: Authority (Awarded on high scoring quiz >= 80%)
		$authority = Badge::where('name', 'Authority')->first();
		$hasHighScore = Veribot::where('user_id', $userId)->where('quiz_score', '>=', 80)->exists();
		if ($authority && !in_array($authority->id, $unlockedBadgeIds) && $hasHighScore) {
			$user->badges()->attach($authority->id);
			$newlyAwarded[] = $authority;
		}

		// Pillar 4: Accuracy (Awarded on perfect 100% quiz score)
		$accuracy = Badge::where('name', 'Accuracy')->first();
		if ($accuracy && !in_array($accuracy->id, $unlockedBadgeIds) && $hasPerfectScore) {
			$user->badges()->attach($accuracy->id);
			$newlyAwarded[] = $accuracy;
		}

		// Pillar 5: Purpose (Awarded when bias/manipulation is correctly analyzed)
		$purpose = Badge::where('name', 'Purpose')->first();
		if ($purpose && !in_array($purpose->id, $unlockedBadgeIds) && $hasIdentifiedBias) {
			$user->badges()->attach($purpose->id);
			$newlyAwarded[] = $purpose;
		}

		return $newlyAwarded;
	}
}
