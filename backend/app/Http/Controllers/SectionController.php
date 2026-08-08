<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Task;
use App\Models\User;
use App\Models\Veribot;
use Illuminate\Http\Request;

class SectionController extends Controller
{
	public function index(Request $request)
	{
		$authUser = $request->user();
		$query = Section::with([
			'teacher:id,username,email',
			'students:id,username,email,section_id,role',
			'students.badges:id,name,description',
			'tasks'
		])->withCount('students');

		if ($authUser && $authUser->role === 'teacher') {
			$query->where('teacher_id', $authUser->id);
		} elseif ($request->filled('teacher_id')) {
			$query->where('teacher_id', $request->input('teacher_id'));
		}

		$sections = $query->get();

		return response()->json([
			'success' => true,
			'data'    => $sections,
		], 200);
	}

	public function store(Request $request)
	{
		$authUser = $request->user();
		if ($authUser && !in_array($authUser->role, ['admin', 'teacher'])) {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$isTeacher = $authUser && $authUser->role === 'teacher';

		if ($request->has('code')) {
			$request->merge(['code' => strtoupper(trim((string)$request->input('code', '')))]);
		}

		$validated = $request->validate([
			'name'       => 'required|string|max:255',
			'code'       => 'required|string|max:50|unique:sections,code',
			'teacher_id' => $isTeacher ? 'nullable|exists:users,id' : 'required|exists:users,id',
		]);

		if ($isTeacher) {
			$validated['teacher_id'] = $authUser->id;
		}

		$section = Section::create($validated);
		$section->load([
			'teacher:id,username,email',
			'students:id,username,email,section_id,role',
			'students.badges:id,name,description',
			'tasks'
		]);
		$section->loadCount('students');

		return response()->json([
			'success' => true,
			'data'    => $section,
		], 201);
	}

	public function show(Request $request, string $id)
	{
		$section = Section::with([
			'teacher:id,username,email',
			'students:id,username,email,section_id,role',
			'students.badges:id,name,description',
			'tasks'
		])->withCount('students')->find($id);

		if (!$section) {
			return response()->json(['success' => false, 'message' => 'Section not found'], 404);
		}

		$authUser = $request->user();
		if ($authUser && $authUser->role === 'teacher' && (int)$section->teacher_id !== (int)$authUser->id) {
			return response()->json(['success' => false, 'message' => 'Unauthorized access to this section.'], 403);
		}

		return response()->json([
			'success' => true,
			'data'    => $section,
		], 200);
	}

	public function update(Request $request, string $id)
	{
		$section = Section::find($id);
		if (!$section) {
			return response()->json(['success' => false, 'message' => 'Section not found'], 404);
		}

		$authUser = $request->user();
		if ($authUser && $authUser->role === 'teacher') {
			if ((int)$section->teacher_id !== (int)$authUser->id) {
				return response()->json(['success' => false, 'message' => 'Unauthorized to update this section.'], 403);
			}
		} elseif ($authUser && $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		if ($request->has('code')) {
			$request->merge(['code' => strtoupper(trim((string)$request->input('code', '')))]);
		}

		$validated = $request->validate([
			'name'       => 'sometimes|string|max:255',
			'code'       => 'sometimes|string|max:50|unique:sections,code,' . $section->id,
			'teacher_id' => 'sometimes|exists:users,id',
		]);

		if ($authUser && $authUser->role === 'teacher') {
			unset($validated['teacher_id']);
		}

		$section->update($validated);
		$section->load([
			'teacher:id,username,email',
			'students:id,username,email,section_id,role',
			'students.badges:id,name,description',
			'tasks'
		]);
		$section->loadCount('students');

		return response()->json([
			'success' => true,
			'data'    => $section,
		], 200);
	}

	public function destroy(Request $request, string $id)
	{
		$section = Section::find($id);
		if (!$section) {
			return response()->json(['success' => false, 'message' => 'Section not found'], 404);
		}

		$authUser = $request->user();
		if ($authUser && $authUser->role === 'teacher') {
			if ((int)$section->teacher_id !== (int)$authUser->id) {
				return response()->json(['success' => false, 'message' => 'Unauthorized to delete this section.'], 403);
			}
		} elseif ($authUser && $authUser->role !== 'admin') {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$section->students()->update(['section_id' => null]);
		$section->delete();
		return response()->json(['success' => true, 'message' => 'Section deleted successfully'], 200);
	}

	public function stats(Request $request, string $id)
	{
		$section = Section::with(['teacher:id,username,email', 'students:id,username,email,section_id,role'])->find($id);
		if (!$section) {
			return response()->json(['success' => false, 'message' => 'Section not found'], 404);
		}

		$authUser = $request->user();
		if ($authUser && $authUser->role === 'teacher' && (int)$section->teacher_id !== (int)$authUser->id) {
			return response()->json(['success' => false, 'message' => 'Unauthorized access to this section.'], 403);
		}

		$studentIds = $section->students->where('role', 'student')->pluck('id');
		$enrolledCount = $studentIds->count();
		$veribots = $studentIds->isNotEmpty() ? Veribot::whereIn('user_id', $studentIds)->get() : collect();
		$veribotCount = $veribots->count();
		$avgScore = $veribotCount > 0 ? (int)round($veribots->avg('quiz_score') ?? 0) : 0;
		$biasCount = $veribots->where('bias_detected', true)->count();
		$biasRate = $veribotCount > 0 ? (int)round(($biasCount / $veribotCount) * 100) : 0;
		$clickbaitRate = VeribotController::calculateClickbaitRate($veribots, $veribotCount);
		$craapBreakdown = VeribotController::calculateCraapBreakdown($veribots, $studentIds, $enrolledCount, $avgScore);
		$activeTasks = Task::where('section_id', $id)->count();

		return response()->json([
			'success' => true,
			'data'    => [
				'section'           => $section,
				'enrolled_students' => $enrolledCount,
				'class_average'     => $avgScore > 0 ? "{$avgScore}%" : "0%",
				'links_verified'    => $veribotCount,
				'active_tasks'      => $activeTasks,
				'craap_breakdown'   => $craapBreakdown,
				'bias_rate'         => $biasRate,
				'clickbait_rate'    => $clickbaitRate,
			]
		], 200);
	}
}
