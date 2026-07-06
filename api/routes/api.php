<?php

use App\Http\Controllers\Auth\AccessTokenController;
use App\Http\Controllers\HeroSectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('tokens', [AccessTokenController::class, 'index']); // Kept from original
Route::delete('tokens', [AccessTokenController::class, 'destroyAll']); // Kept from original
Route::post('login', [AccessTokenController::class, 'store']); // Kept from original

Route::get('hero', [HeroSectionController::class, 'index']);
Route::middleware('auth:sanctum')->put('hero', [HeroSectionController::class, 'update']);
