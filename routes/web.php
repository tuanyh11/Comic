<?php

use App\Http\Controllers\API\CommentController as APICommentController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ComicController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\VNPayController;
use App\Http\Controllers\WalletController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Comic;
use App\Models\Genre;
use App\Models\Genres;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Routes
|--------------------------------------------------------------------------
*/
Broadcast::routes(['middleware' => ['web', 'auth:admin']]);

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
// Welcome page
Route::get('/', function () {
    // Lấy truyện nổi bật - truyện có lượt đọc cao nhất
    $featuredComic = Comic::with(['author' => function ($query) {
            $query->select('id', 'name');
        }])
        ->with('media.media')
        ->with('genres')
        ->with(['chapters' => function($query) {
            $query->count();
        }])
        ->withSum('chapters as read_count', 'read_count')
        ->orderBy('read_count', 'desc')
        ->first();

    // Lấy danh sách truyện cho carousel
    $comicList = Comic::with('media.media')
        ->with('genres')
        ->with(['chapters' => function($query) {
            $query->count();
        }])
        ->withSum('chapters as read_count', 'read_count')
        ->orderBy('read_count', 'desc')
        ->take(9)
        ->get();
    if(empty($featuredComic) || empty($comicList)) {
        return Inertia::render('Empty');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'featuredComic' => $featuredComic,
        'comicList' => $comicList,
    ]);
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Home page
    Route::get('/comic', function () {
        $comics = Comic::with(['author' => function ($query) {
                $query->select('id', 'name');
            }])
            ->with('thumbnail')
            ->with('chapters')
            ->withSum('chapters as read_count', 'read_count')
            ->withSum('chapters as vote_count', 'vote_count') 
            ->paginate(5);
        $genres = Genre::all();

        return Inertia::render('Home', [
            'comics' => $comics,
            'genres' => $genres,
        ]);
    })->name('home');

    // Profile routes
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
        Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');
    });

    // Comic and chapter routes
    Route::get('/comic/{id}', [ComicController::class, 'show'])->name('comic.show');
    
    Route::prefix('comic/{slug}/chapter')->name('chapter.')->group(function () {
        Route::get('/{chapter_id}', [ChapterController::class, 'show'])->name('show');
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

    // Wallet routes
    Route::prefix('wallet')->name('wallet.')->group(function () {
        Route::get('/', [WalletController::class, 'index'])->name('index');
        Route::get('/add-funds', [WalletController::class, 'showAddFunds'])->name('add-funds');
        Route::post('/process-add-funds', [WalletController::class, 'processAddFunds'])->name('process-add-funds');
        Route::get('/purchases', [WalletController::class, 'purchasedChapters'])->name('purchases');
    });

    // Payment routes
    Route::prefix('payment')->name('payment.')->group(function () {
        // VNPay routes
        Route::prefix('vnpay')->name('vnpay.')->group(function () {
            Route::post('/create-wallet-payment', [VNPayController::class, 'createPaymentForWallet'])->name('create-wallet-payment');
            Route::post('/create-chapter-payment/{chapter}', [VNPayController::class, 'createPaymentForChapter'])->name('create-chapter-payment');
            Route::get('/return', [VNPayController::class, 'handleReturnUrl'])->name('return');
        });

        Route::get('/failed', [VNPayController::class, 'showFailedPage'])->name('failed');
        Route::get('/success', [VNPayController::class, 'showSuccessPage'])->name('success');
    });

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    });
});