<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	public function run()
	{
		User::factory()->create([
			'name' => 'admin',
			'email' => 'admin@admin.com',
			'password' => 'password',
		]);
	}
}
