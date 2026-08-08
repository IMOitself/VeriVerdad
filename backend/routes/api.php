<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VeribotController;

Route::middleware('secret.token')->group(function () {
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login'])->name('login');
	Route::get('/sections-list', [SectionController::class, 'index']);

	Route::middleware('auth:sanctum')->group(function () {
		Route::post('/logout', [AuthController::class, 'logout']);
		Route::patch('/profile', [UserController::class, 'updateProfile']);
		Route::get('/profile', [UserController::class, 'showProfile']);

		Route::get('/users', [UserController::class, 'index']);
		Route::patch('/users/{id}', [UserController::class, 'update']);
		Route::delete('/users/{id}', [UserController::class, 'destroy']);

		Route::get('/sections', [SectionController::class, 'index']);
		Route::post('/sections', [SectionController::class, 'store']);
		Route::get('/sections/{id}', [SectionController::class, 'show']);
		Route::get('/sections/{id}/stats', [SectionController::class, 'stats']);
		Route::patch('/sections/{id}', [SectionController::class, 'update']);
		Route::delete('/sections/{id}', [SectionController::class, 'destroy']);

		Route::get('/tasks', [TaskController::class, 'index']);
		Route::post('/tasks', [TaskController::class, 'store']);
		Route::get('/tasks/{id}', [TaskController::class, 'show']);
		Route::patch('/tasks/{id}', [TaskController::class, 'update']);
		Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

		Route::get('/badges', [BadgeController::class, 'index']);
		Route::post('/badges', [BadgeController::class, 'store']);
		Route::get('/badges/{id}', [BadgeController::class, 'show']);
		Route::patch('/badges/{id}', [BadgeController::class, 'update']);
		Route::delete('/badges/{id}', [BadgeController::class, 'destroy']);

		Route::get('/veribot', [VeribotController::class, 'index']);
		Route::get('/veribot/stats', [VeribotController::class, 'stats']);
		Route::post('/veribot', [VeribotController::class, 'analyze']);
		Route::post('/veribot/submit', [VeribotController::class, 'submitQuiz']);
		Route::get('/veribot/history', [VeribotController::class, 'history']);
		Route::get('/veribot/{id}', [VeribotController::class, 'show']);
		Route::delete('/veribot/{id}', [VeribotController::class, 'destroy']);
	});
});