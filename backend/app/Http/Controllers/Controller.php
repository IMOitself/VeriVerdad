<?php

namespace App\Http\Controllers;

abstract class Controller
{
	protected function findOrFail404($model, $id, string $label)
	{
		$record = is_string($model) ? $model::find($id) : $model->find($id);
		if (!$record) {
			return response()->json(['message' => "{$label} not found"], 404);
		}
		return $record;
	}
}
