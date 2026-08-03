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
			['email' => 'teacher@veriverdad.ph'],
			[
				'first_name' => 'Russel',
				'last_name'  => 'Teacher',
				'password'   => 'password123',
				'role'       => 'teacher',
			]
		);

		$section = Section::firstOrCreate(
			['name' => '12-Galatians'],
			['teacher_id' => $teacher->id]
		);

		$student = User::firstOrCreate(
			['email' => 'student@veriverdad.ph'],
			[
				'first_name' => 'Marwin',
				'last_name'  => 'Student',
				'password'   => 'password123',
				'role'       => 'student',
				'section_id' => $section->id,
			]
		);

		$badges = [
			[
				'name'        => 'Fact-Checking Rookie',
				'description' => 'Completed your first VeriBot Socratic quiz.',
				'icon'        => 'shield-check',
			],
			[
				'name'        => 'Critical Thinker',
				'description' => 'Achieved a perfect 100% score on a VeriBot quiz.',
				'icon'        => 'brain',
			],
			[
				'name'        => 'Truth Seeker',
				'description' => 'Verified 5 different claims or news articles.',
				'icon'        => 'search',
			],
			[
				'name'        => 'Eagle Eye',
				'description' => 'Successfully spotted an outdated claim or manipulated graphic.',
				'icon'        => 'eye',
			],
			[
				'name'        => 'Master Fact-Checker',
				'description' => 'Completed 10 media literacy verification tasks.',
				'icon'        => 'award',
			],
		];

		foreach ($badges as $badgeData) {
			Badge::firstOrCreate(['name' => $badgeData['name']], $badgeData);
		}

		Task::firstOrCreate(
			['title' => 'Verify August 2026 Weather Suspension Claim'],
			[
				'teacher_id'       => $teacher->id,
				'section_id'       => $section->id,
				'target_media_url' => 'https://facebook.com/lvcc.announcements/posts/101',
				'due_date'         => now()->addDays(7),
			]
		);
	}
}