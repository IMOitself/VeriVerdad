<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VeribotController;

Route::middleware('secret.token')->group(function () {
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);

	Route::middleware('auth:sanctum')->group(function () {
		Route::post('/logout', [AuthController::class, 'logout']);

		Route::get('/users', [UserController::class, 'index']);
		Route::get('/user', [UserController::class, 'show']);
		Route::get('/users/{id}', [UserController::class, 'show']);
		Route::put('/users/{id?}', [UserController::class, 'update']);
		Route::delete('/users/{id}', [UserController::class, 'destroy']);

		Route::get('/veribot', [VeribotController::class, 'index']);
		Route::post('/veribot', [VeribotController::class, 'analyze']);
		Route::post('/veribot/submit', [VeribotController::class, 'submitQuiz']);
		Route::get('/veribot/history', [VeribotController::class, 'history']);
		Route::get('/veribot/{id}', [VeribotController::class, 'show']);
		Route::delete('/veribot/{id}', [VeribotController::class, 'destroy']);

		Route::get('/tasks', [TaskController::class, 'index']);
		Route::post('/tasks', [TaskController::class, 'store']);
		Route::get('/tasks/{id}', [TaskController::class, 'show']);
		Route::put('/tasks/{id}', [TaskController::class, 'update']);
		Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
		Route::post('/tasks/{id}/submit', [TaskController::class, 'submit']);
		Route::get('/tasks/{id}/submissions', [TaskController::class, 'submissions']);
		Route::delete('/tasks/{id}/submit', [TaskController::class, 'unsubmit']);


		Route::get('/badges', [BadgeController::class, 'index']);
		Route::post('/badges', [BadgeController::class, 'store']);
		Route::get('/badges/{id}', [BadgeController::class, 'show']);
		Route::put('/badges/{id}', [BadgeController::class, 'update']);
		Route::delete('/badges/{id}', [BadgeController::class, 'destroy']);
		Route::post('/badges/{id}/attach', [BadgeController::class, 'attachUser']);
		Route::delete('/badges/{id}/detach', [BadgeController::class, 'detachUser']);
	});
});