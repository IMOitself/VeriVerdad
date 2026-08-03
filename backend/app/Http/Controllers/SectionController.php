<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\User;
use App\Models\Veribot;
use Illuminate\Http\Request;

class SectionController extends Controller
{
	public function index()
	{
		$sections = Section::with('teacher:id,first_name,last_name,email')
			->withCount('students')
			->get();

		return response()->json([
			'success'  => true,
			'data' => $sections,
		]);
	}

	public function store(Request $request)
	{
		$request->validate([
			'name'       => 'required|string|max:100',
			'teacher_id' => 'nullable|exists:users,id',
		]);

		$teacherId = $request->input('teacher_id') ?? $request->user()?->id ?? User::where('role', 'teacher')->value('id');

		$section = Section::create([
			'name'       => $request->input('name'),
			'teacher_id' => $teacherId,
		]);

		return response()->json([
			'success' => true,
			'data'    => $section->load('teacher'),
		], 201);
	}

	public function show(int $id)
	{
		$section = Section::with(['teacher', 'students', 'tasks'])->findOrFail($id);

		return response()->json([
			'success' => true,
			'data'    => $section,
		]);
	}

	public function update(Request $request, int $id)
	{
		$section = Section::findOrFail($id);

		$request->validate([
			'name'       => 'sometimes|string|max:100',
			'teacher_id' => 'nullable|exists:users,id',
		]);

		$section->update($request->only(['name', 'teacher_id']));

		return response()->json([
			'success' => true,
			'data'    => $section->load('teacher'),
		]);
	}

	public function destroy(int $id)
	{
		$section = Section::findOrFail($id);
		$section->delete();

		return response()->json([
			'success' => true,
			'message' => 'Section deleted successfully.',
		]);
	}

	public function assignStudent(Request $request, int $id)
	{
		$request->validate([
			'student_id' => 'required|exists:users,id',
		]);

		$section = Section::findOrFail($id);
		$student = User::findOrFail($request->input('student_id'));
		$student->update(['section_id' => $section->id]);

		return response()->json([
			'success' => true,
			'message' => "Student {$student->full_name} assigned to {$section->name}.",
			'data'    => $student->load('section'),
		]);
	}

	public function stats($id)
	{
		$section = Section::with(['students' => function ($query) {
			$query->withCount('veribots')->with('badges');
		}])->findOrFail($id);

		$studentIds = $section->students->pluck('id');

		$totalVerifications = Veribot::whereIn('user_id', $studentIds)->count();
		$averageScore = Veribot::whereIn('user_id', $studentIds)->avg('quiz_score') ?? 0;
		$biasDetectedCount = Veribot::whereIn('user_id', $studentIds)->where('bias_detected', true)->count();

		$recentVerifications = Veribot::whereIn('user_id', $studentIds)
			->with('user:id,full_name')
			->latest()
			->take(10)
			->get();

		return response()->json([
			'success' => true,
			'section' => [
				'id' => $section->id,
				'name' => $section->name,
				'total_students' => $section->students->count(),
			],
			'analytics' => [
				'total_verifications' => $totalVerifications,
				'class_average_score' => round($averageScore, 1),
				'bias_detection_rate' => $totalVerifications > 0 ? round(($biasDetectedCount / $totalVerifications) * 100, 1) : 0,
			],
			'recent_activity' => $recentVerifications,
			'students' => $section->students->map(function ($s) {
				return [
					'id' => $s->id,
					'name' => $s->full_name,
					'tokens' => $s->tokens_allocated,
					'verifications_count' => $s->veribots_count,
					'badges_count' => $s->badges->count(),
				];
			}),
		]);
	}
}
