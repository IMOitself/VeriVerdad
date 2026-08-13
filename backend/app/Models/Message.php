<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['conversation_id', 'role', 'content', 'reasoning'])]
class Message extends Model
{
	use HasUuids;

	public function conversation()
	{
		return $this->belongsTo(Conversation::class);
	}
}
