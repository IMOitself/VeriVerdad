<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['teacher_id', 'section_id', 'title', 'target_media_url', 'due_date'])]
class Task extends Model
{
	use HasFactory;

	protected function casts(): array
	{
		return [
			'due_date' => 'datetime',
		];
	}

	public function teacher()
	{
		return $this->belongsTo(User::class, 'teacher_id');
	}

	public function section()
	{
		return $this->belongsTo(Section::class, 'section_id');
	}

	public function students()
	{
		return $this->belongsToMany(User::class, 'task_user')
			->withPivot('score')
			->withTimestamps();
	}
}
