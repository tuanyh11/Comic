<?php

use App\Http\Controllers\API\CommentController as APICommentController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ComicController; // Ensure this class exists in the specified namespace
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\VNPayController;
use App\Http\Controllers\WalletController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Comic;
use App\Models\Genres;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Broadcast::routes(['middleware' => ['web', 'auth:admin']]);
// Routes/web.php - Updated Route for Welcome page

// Cập nhật Route cho trang Welcome
Route::get('/', function () {
    // Lấy truyện nổi bật (featured comic) - lấy truyện có lượt đọc cao nhất
    $featuredComic = Comic::with(['author' => function ($query) {
        $query->select('id', 'name', 'avatar');
    }])
    ->with('thumbnail')
    ->with('genres')
    ->with(['chapters' => function($query) {
        $query->count();
    }])
    ->orderBy('read_count', 'desc')
    ->first();

    // Định dạng dữ liệu cho featuredComic
    // Lấy danh sách truyện cho carousel
    $comicList = Comic::with('thumbnail')
    ->with('thumbnail')
    ->with('genres')
    ->with(['chapters' => function($query) {
        $query->count();
    }])
        ->orderBy('read_count', 'desc')
        ->take(9)
        ->get();
        
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'featuredComic' => $featuredComic,
        'comicList' => $comicList,
    ]);
});

Route::get('/comic', function () {
    $comics = Comic::with(['author' => function ($query) {
        $query->select('id', 'name');
    }])
        ->with('thumbnail')
        ->with('chapters')
        ->withSum('chapters as read_count', 'read_count')  // Đổi tên thành total_reads
        ->withSum('chapters as vote_count', 'vote_count') 
        ->paginate(5);
    $genres = Genres::all();

    return Inertia::render('Home', [
        'comics' => $comics,
        'genres' => $genres,
    ]);
})->middleware(['auth', 'verified'])->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/comic/{id}', [ComicController::class, 'show'])->name('comic.show');

    // Chapter routes with Inertia
    Route::get('/comic/{slug}/chapter/{chapter_id}', [ChapterController::class, 'show'])
        ->name('chapter.show');
    Route::get('/comic/{slug}/chapter/{chapter_id}/iframe', [ChapterController::class, 'showIFrame'])
        ->name('chapter.show.iframe');

    // Comment routes for Inertia
    Route::post('/chapter/{chapter_id}/comments', [CommentController::class, 'store'])
        ->name('chapter.comment.store');
    Route::post('/chapters/{chapter_id}/vote', [ChapterController::class, 'vote'])->name('chapters.vote');


    Route::get('/chapter/{chapter_id}/comments', [APICommentController::class, 'index'])->name('chapter.comments');
    Route::post('/chapter/{chapter_id}/comments', [APICommentController::class, 'store'])->name('chapter.comment.store');
    
    // Added routes for comment replies
    Route::get('/comments/{comment_id}/replies', [APICommentController::class, 'getReplies'])->name('comments.replies');
    
    Route::get('/comments/{comment_id}', [APICommentController::class, 'show'])->name('comments.get');
    // Generic comments endpoint for creating both comments and replies
});


Route::prefix('payment/vnpay')->name('payment.vnpay.')->middleware(['auth'])->group(function () {
    Route::post('/create-wallet-payment', [VNPayController::class, 'createPaymentForWallet'])
        ->name('create-wallet-payment');
    
    Route::post('/create-chapter-payment/{chapter}', [VNPayController::class, 'createPaymentForChapter'])
        ->name('create-chapter-payment');
    
    Route::get('/return', [VNPayController::class, 'handleReturnUrl'])
        ->name('return');
});

Route::get('/payment/failed', [VNPayController::class, 'showFailedPage'])
    ->name('payment.failed');



Route::middleware(['auth'])->group(function () {
    Route::prefix('wallet')->name('wallet.')->group(function () {
        Route::get('/', [WalletController::class, 'index'])->name('index');
        Route::get('/add-funds', [WalletController::class, 'showAddFunds'])->name('add-funds');
        Route::post('/process-add-funds', [WalletController::class, 'processAddFunds'])->name('process-add-funds');
        Route::get('/purchases', [WalletController::class, 'purchasedChapters'])->name('purchases');
    });

    // VNPay routes - applying auth middleware here
    Route::prefix('payment/vnpay')->name('payment.vnpay.')->group(function () {
        Route::post('/create-wallet-payment', [VNPayController::class, 'createPaymentForWallet'])->name('create-wallet-payment');
        Route::post('/create-chapter-payment/{chapter}', [VNPayController::class, 'createPaymentForChapter'])->name('create-chapter-payment');
        Route::get('/return', [VNPayController::class, 'handleReturnUrl'])->name('return');
    });

    Route::get('/payment/failed', [VNPayController::class, 'showFailedPage'])->name('payment.failed');
    Route::get('/payment/success', [VNPayController::class, 'showSuccessPage'])->name('payment.success');

    Route::post('/chapters/{chapter_id}/purchase', [ChapterController::class, 'purchaseWithWallet'])
    ->name('chapters.purchase-with-wallet');
});

Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
});


require __DIR__ . '/auth.php';
