<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SectionSeeder extends Seeder
{
	public function run(): void
	{
		$teacher = User::firstOrCreate(
			['email' => 'teacher@example.edu'],
			[
				'username' => 'prof_mil_advisor',
				'password' => Hash::make('teacher123'),
				'role'     => 'teacher',
			]
		);

		$sectionsData = [
			['name' => '12 - Galatians', 'code' => '12-GAL', 'teacher_id' => $teacher->id],
			['name' => '12 - Corinthians', 'code' => '12-COR', 'teacher_id' => $teacher->id],
			['name' => '12 - Ephesians', 'code' => '12-EPH', 'teacher_id' => $teacher->id],
		];

		$createdSections = [];
		foreach ($sectionsData as $s) {
			$createdSections[] = Section::updateOrCreate(['code' => $s['code']], $s);
		}

		// Assign students into sections
		$students = User::where('role', 'student')->get();
		foreach ($students as $idx => $student) {
			$section = $createdSections[$idx % count($createdSections)];
			$student->update(['section_id' => $section->id]);
		}
	}
}
