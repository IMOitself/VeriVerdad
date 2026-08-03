<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();

		if ($user && $user->role === 'teacher') {
			$tasks = Task::where('teacher_id', $user->id)
				->with(['section', 'students'])
				->latest()
				->get()
				->map(function ($task) {
					$task->submission_count = $task->students->count();
					$task->average_score = $task->students->avg('pivot.score') ?? 0;
					return $task;
				});

			return response()->json([
				'success' => true,
				'data'    => $tasks,
			]);
		}

		$sectionId = $user?->section_id ?? Section::value('id');

		$tasks = Task::where('section_id', $sectionId)
			->with('teacher')
			->latest()
			->get()
			->map(function ($task) use ($user) {
				$userId = $user?->id ?? User::where('role', 'student')->value('id');
				$submission = $task->students()->where('user_id', $userId)->first();
				$task->is_completed = (bool)$submission;
				$task->user_score = $submission?->pivot?->score;
				return $task;
			});

		return response()->json([
			'success' => true,
			'data'    => $tasks,
		]);
	}

	public function store(Request $request)
	{
		$request->validate([
			'section_id'       => 'required|exists:sections,id',
			'title'            => 'required|string|max:255',
			'target_media_url' => 'required|string',
			'due_date'         => 'required|date',
		]);

		$teacherId = $request->user()?->id ?? User::where('role', 'teacher')->value('id') ?? 1;

		$task = Task::create([
			'teacher_id'       => $teacherId,
			'section_id'       => $request->input('section_id'),
			'title'            => $request->input('title'),
			'target_media_url' => $request->input('target_media_url'),
			'due_date'         => $request->input('due_date'),
		]);

		return response()->json([
			'success' => true,
			'data'    => $task->load('section'),
		], 201);
	}

	public function show($id, Request $request)
	{
		$task = Task::with(['section', 'teacher'])->findOrFail($id);
		$user = $request->user();

		if ($user && $user->role === 'teacher') {
			$task->load('students');
		} else {
			$userId = $user?->id ?? User::where('role', 'student')->value('id');
			$submission = $task->students()->where('user_id', $userId)->first();
			$task->is_completed = (bool)$submission;
			$task->user_score = $submission?->pivot?->score;
		}

		return response()->json([
			'success' => true,
			'data'    => $task,
		]);
	}

	public function submit($id, Request $request)
	{
		$request->validate([
			'score' => 'required|integer|min:0|max:100',
		]);

		$task = Task::findOrFail($id);
		$userId = $request->user()?->id ?? User::where('role', 'student')->value('id') ?? 1;
		$score = (int)$request->input('score');

		$task->students()->syncWithoutDetaching([
			$userId => ['score' => $score],
		]);

		$newBadges = BadgeController::evaluateBadges($userId);

		return response()->json([
			'success'    => true,
			'task_id'    => $task->id,
			'score'      => $score,
			'new_badges' => $newBadges,
		]);
	}

	public function update($id, Request $request)
	{
		$task = Task::findOrFail($id);

		$request->validate([
			'title'            => 'sometimes|string|max:255',
			'target_media_url' => 'sometimes|string',
			'due_date'         => 'sometimes|date',
		]);

		$task->update($request->only(['title', 'target_media_url', 'due_date', 'section_id']));

		return response()->json([
			'success' => true,
			'data'    => $task->load('section'),
		]);
	}

	public function destroy($id)
	{
		$task = Task::findOrFail($id);
		$task->delete();

		return response()->json([
			'success' => true,
			'message' => 'Task deleted successfully.',
		]);
	}

	public function submissions($id)
	{
		$task = Task::findOrFail($id);
		$submissions = $task->students()->withPivot('score', 'created_at', 'updated_at')->get();

		return response()->json([
			'success' => true,
			'task'    => [
				'id'    => $task->id,
				'title' => $task->title,
			],
			'data'    => $submissions,
		]);
	}

	public function unsubmit($id, Request $request)
	{
		$task = Task::findOrFail($id);
		$userId = $request->input('student_id') ?? $request->user()?->id;

		$task->students()->detach($userId);

		return response()->json([
			'success' => true,
			'message' => 'Task submission cleared.',
		]);
	}
}
