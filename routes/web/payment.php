<?php

use App\Http\Controllers\VNPayController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

Route::prefix('payment')->name('payment.')->group(function () {
    // VNPay routes
    Route::prefix('vnpay')->name('vnpay.')->group(function () {
        Route::post('/create-wallet-payment', [VNPayController::class, 'createPaymentForWallet'])->name('create-wallet-payment');
        Route::post('/create-chapter-payment/{chapter}', [VNPayController::class, 'createPaymentForChapter'])->name('create-chapter-payment');
        Route::get('/return', [VNPayController::class, 'handleReturnUrl'])->name('return');
    });

    // Payment status pages
    Route::get('/failed', [VNPayController::class, 'showFailedPage'])->name('failed');
    Route::get('/success', [VNPayController::class, 'showSuccessPage'])->name('success');
});