<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/student/grades', [StudentController::class, 'grades']);
    Route::get('/student/notifications', [StudentController::class, 'notifications']);

    Route::prefix('teacher')->group(function (): void {
        Route::get('/students', [TeacherController::class, 'students']);
        Route::post('/grades', [TeacherController::class, 'saveGrades']);
        Route::post('/resources', [TeacherController::class, 'uploadResource']);
    });
});
