<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['username', 'email', 'password', 'role', 'section_id'])]
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
		return $this->belongsTo(Section::class, 'section_id');
	}

	public function taughtSections()
	{
		return $this->hasMany(Section::class, 'teacher_id');
	}

	public function tasks()
	{
		return $this->belongsToMany(Task::class, 'task_user')
			->withPivot('score')
			->withTimestamps();
	}

	public function createdTasks()
	{
		return $this->hasMany(Task::class, 'teacher_id');
	}

	public function badges()
	{
		return $this->belongsToMany(Badge::class, 'badge_user')
			->withTimestamps();
	}

	public function veribots()
	{
		return $this->hasMany(Veribot::class);
	}
}