<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['first_name', 'last_name', 'email', 'password', 'role', 'section_id'])]
#[Hidden(['password'])]
class User extends Authenticatable
{
	use HasFactory, HasApiTokens;

	protected function casts(): array
	{
		return [
			'password' => 'hashed',
		];
	}

	public function section()
	{
		return $this->belongsTo(Section::class);
	}
}