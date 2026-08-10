<?php

namespace App\Http\Traits;

trait ApiResponder
{
	protected function success($data = null, $message = null, $status = 200)
	{
		return response()->json(['status' => 'success', 'message' => $message, 'data' => $data], $status);
	}

	protected function error($message = null, $status = 400, $errors = null)
	{
		return response()->json(['status' => 'error', 'message' => $message, 'errors' => $errors], $status);
	}
}
