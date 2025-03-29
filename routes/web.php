<?php

use App\Http\Controllers\TermsController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Routes
|--------------------------------------------------------------------------
*/
Broadcast::routes(['middleware' => ['web', 'auth:admin']]);

/*
|--------------------------------------------------------------------------
| Welcome Route
|--------------------------------------------------------------------------
*/
Route::get('/', [WelcomeController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Terms Routes
|--------------------------------------------------------------------------
*/
Route::get('/terms', [TermsController::class, 'termsOfService'])->name('terms');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Include modularized route files
    require __DIR__ . '/web/comic.php';
    require __DIR__ . '/web/chapter.php';
    require __DIR__ . '/web/profile.php';
    require __DIR__ . '/web/wallet.php';
    require __DIR__ . '/web/payment.php';
    require __DIR__ . '/web/notification.php';
});