<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['name', 'code', 'teacher_id'])]
class Section extends Model
{
	use HasFactory;

	public function teacher()
	{
		return $this->belongsTo(User::class, 'teacher_id');
	}

	public function students()
	{
		return $this->hasMany(User::class, 'section_id');
	}

	public function tasks()
	{
		return $this->hasMany(Task::class, 'section_id');
	}
}
