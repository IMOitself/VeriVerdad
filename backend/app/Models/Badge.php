<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'icon'])]
class Badge extends Model
{
	use HasFactory;

	public function users()
	{
		return $this->belongsToMany(User::class, 'badge_user')
			->withTimestamps();
	}
}
