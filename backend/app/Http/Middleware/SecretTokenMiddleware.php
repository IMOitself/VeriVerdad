<?php

namespace App\Http\Middleware;

class SecretTokenMiddleware
{
	public function handle($request, $next)
	{
		$secretToken = config('secret.token');

		if (empty($secretToken) || $request->header('X-Secret-Token') !== $secretToken) {
			abort(401);
		}

		return $next($request);
	}
}
