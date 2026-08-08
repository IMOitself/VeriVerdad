<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Badge;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$students = [
			['username' => 'juan_dela_cruz', 'email' => 'juan.delacruz@student.laverdad.edu.ph'],
			['username' => 'maria_santos', 'email' => 'maria.santos@student.laverdad.edu.ph'],
			['username' => 'jose_reyes', 'email' => 'jose.reyes@student.laverdad.edu.ph'],
			['username' => 'ana_gonzales', 'email' => 'ana.gonzales@student.laverdad.edu.ph'],
			['username' => 'mark_bautista', 'email' => 'mark.bautista@student.laverdad.edu.ph'],
			['username' => 'grace_ramos', 'email' => 'grace.ramos@student.laverdad.edu.ph'],
			['username' => 'carlo_mendoza', 'email' => 'carlo.mendoza@student.laverdad.edu.ph'],
			['username' => 'bea_aquino', 'email' => 'bea.aquino@student.laverdad.edu.ph'],
			['username' => 'paulo_castro', 'email' => 'paulo.castro@student.laverdad.edu.ph'],
			['username' => 'joyce_torres', 'email' => 'joyce.torres@student.laverdad.edu.ph'],
			['username' => 'david_villanueva', 'email' => 'david.villanueva@student.laverdad.edu.ph'],
			['username' => 'sam_rodriguez', 'email' => 'sam.rodriguez@student.laverdad.edu.ph'],
		];

		$badges = Badge::pluck('id');

		foreach ($students as $index => $student) {
			$user = User::updateOrCreate(
				['email' => $student['email']],
				[
					'username' => $student['username'],
					'password' => Hash::make('password123'),
					'role' => 'student',
				]
			);

			if ($badges->isNotEmpty()) {
				$takeCount = ($index % 3) + 2;
				$user->badges()->sync($badges->take($takeCount));
			}
		}
	}
}
