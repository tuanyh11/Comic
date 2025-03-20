<?php

namespace App\Http\Controllers;

use App\Models\Comic;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WelcomeController extends Controller
{
      public function index()
    {
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
        
        return Inertia::render('Welcome/index', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'featuredComic' => $featuredComic,
            'comicList' => $comicList,
        ]);
    }
}
