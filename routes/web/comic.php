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

// Show comic details
Route::get('/comic/{id}', [ComicController::class, 'show'])->name('comic.show');