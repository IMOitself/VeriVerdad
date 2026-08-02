<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('tasks', function (Blueprint $table) {
			$table->id();
			$table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
			$table->foreignId('section_id')->constrained('sections')->cascadeOnDelete();
			$table->string('title');
			$table->text('target_media_url');
			$table->timestamp('due_date');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('tasks');
	}
};
