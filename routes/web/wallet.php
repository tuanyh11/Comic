<?php

use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Wallet Routes
|--------------------------------------------------------------------------
*/

Route::prefix('wallet')->name('wallet.')->group(function () {
    Route::get('/', [WalletController::class, 'index'])->name('index');
    Route::get('/add-funds', [WalletController::class, 'showAddFunds'])->name('add-funds');
    Route::post('/process-add-funds', [WalletController::class, 'processAddFunds'])->name('process-add-funds');
    Route::get('/purchases', [WalletController::class, 'purchasedChapters'])->name('purchases');
});