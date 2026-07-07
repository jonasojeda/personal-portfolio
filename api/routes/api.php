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
Route::get('skills', [\App\Http\Controllers\SkillCategoryController::class, 'index']);
Route::get('experiences/{lang?}', [\App\Http\Controllers\ExperienceController::class, 'index']);
Route::get('projects/{lang?}', [\App\Http\Controllers\ProjectController::class, 'index']);
Route::get('blogs/{lang?}', [\App\Http\Controllers\BlogController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::put('hero', [HeroSectionController::class, 'update']);
    Route::post('cv', [\App\Http\Controllers\CVController::class, 'upload']);
    
    // Skills Management
    Route::post('skills', [\App\Http\Controllers\SkillCategoryController::class, 'store']);
    Route::put('skills/{id}', [\App\Http\Controllers\SkillCategoryController::class, 'update']);
    Route::delete('skills/{id}', [\App\Http\Controllers\SkillCategoryController::class, 'destroy']);

    // Experience Management
    Route::post('experiences', [\App\Http\Controllers\ExperienceController::class, 'store']);
    Route::put('experiences/{id}', [\App\Http\Controllers\ExperienceController::class, 'update']);
    Route::delete('experiences/{id}', [\App\Http\Controllers\ExperienceController::class, 'destroy']);

    // Project Management
    Route::post('projects/upload-image', [\App\Http\Controllers\ProjectController::class, 'uploadImage']);
    Route::post('projects', [\App\Http\Controllers\ProjectController::class, 'store']);
    Route::put('projects/{id}', [\App\Http\Controllers\ProjectController::class, 'update']);
    Route::delete('projects/{id}', [\App\Http\Controllers\ProjectController::class, 'destroy']);

    // Blog Management
    Route::post('blogs/upload-image', [\App\Http\Controllers\BlogController::class, 'uploadImage']);
    Route::post('blogs', [\App\Http\Controllers\BlogController::class, 'store']);
    Route::put('blogs/{id}', [\App\Http\Controllers\BlogController::class, 'update']);
    Route::delete('blogs/{id}', [\App\Http\Controllers\BlogController::class, 'destroy']);
});
