<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Section;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		$teacher = User::create([
			'first_name' => 'Russel',
			'last_name'  => 'Teacher',
			'email'      => 'teacher@veriverdad.ph',
			'password'   => 'password123',
			'role'       => 'teacher',
		]);

		$section = Section::create([
			'name'       => '12-Galatians',
			'teacher_id' => $teacher->id,
		]);

		User::create([
			'first_name' => 'Marwin',
			'last_name'  => 'Student',
			'email'      => 'student@veriverdad.ph',
			'password'   => 'password123',
			'role'       => 'student',
			'section_id' => $section->id,
		]);
	}
}