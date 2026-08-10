<?php

namespace App\Http\Middleware;

class SecretTokenMiddleware extends Middleware
{
	public function handle($request, $next)
	{
		$secretToken = config('secret.token');

		if (empty($secretToken) || $request->header('X-Secret-Token') !== $secretToken) {
			return $this->error('Unauthorized.', 401);
		}

		return $next($request);
	}
}
