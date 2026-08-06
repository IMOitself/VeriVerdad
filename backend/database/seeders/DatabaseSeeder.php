<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Section;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	public function run(): void
	{

		$badges = [
			[
				'name'        => 'Currency',
				'description' => 'Mastered checking dates, timelines, and information freshness.',
				'icon'        => 'calendar',
			],
			[
				'name'        => 'Relevance',
				'description' => 'Mastered evaluating topic fit and audience context.',
				'icon'        => 'filter',
			],
			[
				'name'        => 'Authority',
				'description' => 'Mastered verifying author credentials and official primary sources.',
				'icon'        => 'badge-check',
			],
			[
				'name'        => 'Accuracy',
				'description' => 'Mastered cross-referencing claims and verifying factual evidence.',
				'icon'        => 'check-circle',
			],
			[
				'name'        => 'Purpose',
				'description' => 'Mastered detecting bias, emotional manipulation, and author intent.',
				'icon'        => 'eye',
			],
		];

		foreach ($badges as $badgeData) {
			Badge::firstOrCreate(['name' => $badgeData['name']], $badgeData);
		}
	}
}