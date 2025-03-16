<?php

use Illuminate\Support\Facades\Route;
use Plugins\MediaManager\Http\Controllers\MediaController;

// Routes chỉ khả dụng khi đã đăng nhập vào Filament
Route::middleware(['web', config('filament.middleware.auth')])->group(function () {
    // API routes cho việc tải lên và quản lý media
    Route::prefix('api/media-manager')->name('media-manager.')->group(function () {
        Route::post('/upload', [MediaController::class, 'upload'])->name('upload');
        Route::delete('/{media}', [MediaController::class, 'destroy'])->name('destroy');
        Route::get('/', [MediaController::class, 'index'])->name('index');
    });
});