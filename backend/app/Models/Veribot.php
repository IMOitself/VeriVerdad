<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'task_id', 'title', 'input_query', 'quiz_score', 'bias_detected', 'details'])]
class Veribot extends Model
{
	use HasFactory;

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
