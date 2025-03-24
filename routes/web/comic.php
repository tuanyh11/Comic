<?php

use App\Http\Controllers\ComicController;
use App\Models\Comic;
use App\Models\Genre;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Comic Routes
|--------------------------------------------------------------------------
*/

// Home page with comic list
Route::get('/comic', function () {
    $query = Comic::query()
        ->with(['author' => function ($query) {
            $query->select('id', 'name');
        }])
        ->with('thumbnail')
        ->with('chapters')
        ->withSum('chapters as read_count', 'read_count')
        ->withSum('chapters as vote_count', 'vote_count');
    
    // Apply genre filter if provided
    if (request()->has('genre')) {
        $genreId = request()->input('genre');
        $query->whereHas('genres', function($q) use ($genreId) {
            $q->where('genres.id', $genreId);
        });
    }
    
    // Apply sorting based on the tab selection
    $tab = request()->input('tab', 'for-you');
    switch ($tab) {
        case 'trending':
            // Sort by read count for trending comics
            $query->orderBy('read_count', 'desc');
            break;
        case 'hot':
            // Sort by recently updated with high read count
            $query->orderBy('updated_at', 'desc')
                  ->orderBy('read_count', 'desc');
            break;
        case 'favorite':
            // Sort by vote count for favorite comics
            $query->orderBy('vote_count', 'desc');
            break;
        default:
            // Default sorting (for-you) - can be personalized later
            $query->orderBy('created_at', 'desc');
            break;
    }
    
    $comics = $query->paginate(15);
    $genres = Genre::all();
    return Inertia::render('Home', [
        'comics' => $comics,
        'genres' => $genres,
        'genreFilters' => request()->input('genre'),
        'activeTab' => $tab,
    ]);
})->name('home');

// Show comic details
Route::get('/comic/{id}', [ComicController::class, 'show'])->name('comic.show');