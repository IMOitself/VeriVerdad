<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
	public function index(Request $request)
	{
		$authUser = $request->user();
		if (!$authUser) {
			return response()->json(['data' => []], 200);
		}

		$query = Task::with(['teacher', 'section']);
		if ($authUser->role === 'student') {
			$query->where('section_id', $authUser->section_id);
		} elseif ($authUser->role === 'teacher') {
			$query->where('teacher_id', $authUser->id);
		}

		$tasks = $query->get();
		return response()->json(['data' => $tasks], 200);
	}

	public function store(Request $request)
	{
		$authUser = $request->user();
		if (!$authUser || !in_array($authUser->role, ['admin', 'teacher'])) {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$validated = $request->validate([
			'teacher_id' => ['required', \Illuminate\Validation\Rule::exists('users', 'id')->whereIn('role', ['teacher', 'admin'])],
			'section_id' => 'nullable|exists:sections,id',
			'title' => 'required|string|max:255',
			'target_media_url' => 'required|url',
			'due_date' => 'required|date',
		]);

		$task = Task::create($validated);

		return response()->json(['data' => $task], 201);
	}

	public function show(string $id)
	{
		$task = $this->findOrFail404(Task::with(['teacher', 'section']), $id, 'Task');
		if ($task instanceof \Illuminate\Http\JsonResponse) {
			return $task;
		}
		return response()->json(['data' => $task], 200);
	}

	public function update(Request $request, string $id)
	{
		$authUser = $request->user();
		if (!$authUser || !in_array($authUser->role, ['admin', 'teacher'])) {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$task = $this->findOrFail404(Task::class, $id, 'Task');
		if ($task instanceof \Illuminate\Http\JsonResponse) {
			return $task;
		}

		if ($authUser->role === 'teacher' && (int)$task->teacher_id !== (int)$authUser->id) {
			return response()->json(['success' => false, 'message' => 'Unauthorized to update this task.'], 403);
		}

		$validated = $request->validate([
			'teacher_id' => ['sometimes', \Illuminate\Validation\Rule::exists('users', 'id')->whereIn('role', ['teacher', 'admin'])],
			'section_id' => 'sometimes|nullable|exists:sections,id',
			'title' => 'sometimes|string|max:255',
			'target_media_url' => 'sometimes|url',
			'due_date' => 'sometimes|date',
		]);

		$task->update($validated);

		return response()->json(['data' => $task], 200);
	}

	public function destroy(Request $request, string $id)
	{
		$authUser = $request->user();
		if (!$authUser || !in_array($authUser->role, ['admin', 'teacher'])) {
			return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
		}

		$task = $this->findOrFail404(Task::class, $id, 'Task');
		if ($task instanceof \Illuminate\Http\JsonResponse) {
			return $task;
		}

		if ($authUser->role === 'teacher' && (int)$task->teacher_id !== (int)$authUser->id) {
			return response()->json(['success' => false, 'message' => 'Unauthorized to delete this task.'], 403);
		}

		$task->delete();
		return response()->json(['message' => 'Task deleted successfully'], 200);
	}
}
