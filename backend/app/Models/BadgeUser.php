<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Fillable(['user_id', 'badge_id'])]
class BadgeUser extends Pivot
{
	use HasFactory;

	protected $table = 'badge_user';

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function badge()
	{
		return $this->belongsTo(Badge::class);
	}
}
