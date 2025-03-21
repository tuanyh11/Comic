<?php

use App\Http\Controllers\API\NotificationController as APINotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/

Route::prefix('notifications')->group(function () {
    Route::get('/', [APINotificationController::class, 'index']);
    Route::post('/{id}/mark-as-read', [APINotificationController::class, 'markAsRead']);
    Route::post('/mark-all-as-read', [APINotificationController::class, 'markAllAsRead']);
});