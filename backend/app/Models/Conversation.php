<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'title'])]
class Conversation extends Model
{
	use HasUuids;

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function messages()
	{
		return $this->hasMany(Message::class);
	}
}
