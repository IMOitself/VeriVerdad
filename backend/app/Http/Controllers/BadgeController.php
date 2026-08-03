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
		$userId = $request->user()?->id ?? User::where('role', 'student')->value('id') ?? 1;
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

	public static function evaluateBadges(int $userId): array
	{
		$user = User::find($userId);
		if (!$user) return [];

		$unlockedBadgeIds = $user->badges()->pluck('badges.id')->toArray();
		$newlyAwarded = [];

		$veribotCount = Veribot::where('user_id', $userId)->count();
		$hasPerfectScore = Veribot::where('user_id', $userId)->where('quiz_score', 100)->exists();

		// Badge 1: Fact-Checking Rookie (completed at least 1 quiz)
		$rookie = Badge::where('name', 'Fact-Checking Rookie')->first();
		if ($rookie && !in_array($rookie->id, $unlockedBadgeIds) && $veribotCount >= 1) {
			$user->badges()->attach($rookie->id);
			$newlyAwarded[] = $rookie;
		}

		// Badge 2: Critical Thinker (100% quiz score)
		$thinker = Badge::where('name', 'Critical Thinker')->first();
		if ($thinker && !in_array($thinker->id, $unlockedBadgeIds) && $hasPerfectScore) {
			$user->badges()->attach($thinker->id);
			$newlyAwarded[] = $thinker;
		}

		// Badge 3: Truth Seeker (verified 5 claims)
		$seeker = Badge::where('name', 'Truth Seeker')->first();
		if ($seeker && !in_array($seeker->id, $unlockedBadgeIds) && $veribotCount >= 5) {
			$user->badges()->attach($seeker->id);
			$newlyAwarded[] = $seeker;
		}

		return $newlyAwarded;
	}
}
