<?php

use App\Http\Controllers\API\CommentController as APICommentController;
use App\Http\Controllers\ChapterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Chapter Routes
|--------------------------------------------------------------------------
*/

// Chapter related routes
Route::prefix('comic/{slug}/chapter')->name('chapter.')->group(function () {
    Route::get('/{chapter_id}', [ChapterController::class, 'show'])->name('show');
    Route::get('/{chapter_id}/preview', [ChapterController::class, 'preview'])->name('preview');
    Route::get('/{chapter_id}/iframe', [ChapterController::class, 'showIFrame'])->name('show.iframe');
    Route::post('/{chapter_id}/vote', [ChapterController::class, 'vote'])->name('vote');
    Route::post('/{chapter_id}/purchase', [ChapterController::class, 'purchaseWithWallet'])->name('purchase-with-wallet');
});

// Comment routes
Route::prefix('chapter/{chapter_id}')->name('chapter.')->group(function () {
    Route::get('/comments', [APICommentController::class, 'index'])->name('comments');
    Route::post('/comments', [APICommentController::class, 'store'])->name('comment.store');
});

Route::prefix('comments')->name('comments.')->group(function () {
    Route::get('/{comment_id}/replies', [APICommentController::class, 'getReplies'])->name('replies');
    Route::get('/{comment_id}', [APICommentController::class, 'show'])->name('get');
});