<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
	public function index()
	{
		$tasks = Task::with(['teacher', 'section'])->get();
		return response()->json(['data' => $tasks], 200);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'teacher_id' => 'required|exists:users,id',
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
		$task = Task::with(['teacher', 'section'])->find($id);
		if (!$task) {
			return response()->json(['message' => 'Task not found'], 404);
		}
		return response()->json(['data' => $task], 200);
	}

	public function update(Request $request, string $id)
	{
		$task = Task::find($id);
		if (!$task) {
			return response()->json(['message' => 'Task not found'], 404);
		}

		$validated = $request->validate([
			'teacher_id' => 'sometimes|exists:users,id',
			'section_id' => 'sometimes|nullable|exists:sections,id',
			'title' => 'sometimes|string|max:255',
			'target_media_url' => 'sometimes|url',
			'due_date' => 'sometimes|date',
		]);

		$task->update($validated);

		return response()->json(['data' => $task], 200);
	}

	public function destroy(string $id)
	{
		$task = Task::find($id);
		if (!$task) {
			return response()->json(['message' => 'Task not found'], 404);
		}

		$task->delete();
		return response()->json(['message' => 'Task deleted successfully'], 200);
	}
}
