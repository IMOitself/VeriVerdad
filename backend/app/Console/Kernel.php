<?php

namespace App\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
	protected function schedule($schedule)
	{
		$schedule->command('sanctum:prune-expired --hours=24')->daily();
	}
}
