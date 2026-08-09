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
			['username' => 'juan_dela_cruz', 'email' => 'juan.delacruz@student.example.edu'],
			['username' => 'maria_santos', 'email' => 'maria.santos@student.example.edu'],
			['username' => 'jose_reyes', 'email' => 'jose.reyes@student.example.edu'],
			['username' => 'ana_gonzales', 'email' => 'ana.gonzales@student.example.edu'],
			['username' => 'mark_bautista', 'email' => 'mark.bautista@student.example.edu'],
			['username' => 'grace_ramos', 'email' => 'grace.ramos@student.example.edu'],
			['username' => 'carlo_mendoza', 'email' => 'carlo.mendoza@student.example.edu'],
			['username' => 'bea_aquino', 'email' => 'bea.aquino@student.example.edu'],
			['username' => 'paulo_castro', 'email' => 'paulo.castro@student.example.edu'],
			['username' => 'joyce_torres', 'email' => 'joyce.torres@student.example.edu'],
			['username' => 'david_villanueva', 'email' => 'david.villanueva@student.example.edu'],
			['username' => 'sam_rodriguez', 'email' => 'sam.rodriguez@student.example.edu'],
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
				$takeCount = rand(1, 4);
				$user->badges()->sync($badges->random($takeCount));
			}
		}
	}
}
