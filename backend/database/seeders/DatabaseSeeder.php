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
		$teacher = User::firstOrCreate(
			['email' => 'teacher@demo.com'],
			[
				'first_name' => 'Demo',
				'last_name'  => 'Teacher',
				'password'   => 'V3ri#Verd@d2026!',
				'role'       => 'teacher',
			]
		);

		$section = Section::firstOrCreate(
			['name' => '12-Galatians'],
			['teacher_id' => $teacher->id]
		);

		$student = User::firstOrCreate(
			['email' => 'student@demo.com'],
			[
				'first_name' => 'Demo',
				'last_name'  => 'Student',
				'password'   => 'V3ri#Verd@d2026!',
				'role'       => 'student',
				'section_id' => $section->id,
			]
		);

		// Also seed demo@demo.com for convenience
		User::firstOrCreate(
			['email' => 'demo@demo.com'],
			[
				'first_name' => 'Demo',
				'last_name'  => 'User',
				'password'   => 'V3ri#Verd@d2026!',
				'role'       => 'student',
				'section_id' => $section->id,
			]
		);

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