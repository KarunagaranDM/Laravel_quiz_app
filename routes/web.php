<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::post('/submit-quiz', [QuestionController::class, 'submitQuiz']);
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');


Route::group([
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});
