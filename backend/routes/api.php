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
	Route::post('/login', [AuthController::class, 'login'])->name('login');

	Route::middleware('auth:sanctum')->group(function () {
		Route::post('/logout', [AuthController::class, 'logout']);
		Route::patch('/profile', [UserController::class, 'updateProfile']);
		Route::get('/profile', [UserController::class, 'showProfile']);

		Route::get('/users', [UserController::class, 'index']);
		Route::patch('/users/{id}', [UserController::class, 'update']);
		Route::delete('/users/{id}', [UserController::class, 'destroy']);
		Route::get('/veribot', [VeribotController::class, 'index']);
		Route::post('/veribot', [VeribotController::class, 'analyze']);
		Route::post('/veribot/submit', [VeribotController::class, 'submitQuiz']);
		Route::get('/veribot/history', [VeribotController::class, 'history']);
		Route::get('/veribot/{id}', [VeribotController::class, 'show']);
		Route::delete('/veribot/{id}', [VeribotController::class, 'destroy']); 
		});
});