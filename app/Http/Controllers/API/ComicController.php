<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ComicController extends Controller
{
    /**
     * Tìm kiếm truyện theo tiêu đề hoặc tác giả
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        
        if (empty($query)) {
            return response()->json([
                'comics' => []
            ]);
        }

        // Cache kết quả tìm kiếm trong 1 giờ
        $cacheKey = 'comic_search_' . md5($query);
        
        $comics = Cache::remember($cacheKey, 60 * 60, function () use ($query) {
            return Comic::where('title', 'LIKE', "%{$query}%")
                ->orWhereHas('author', function($q) use ($query) {
                    $q->where('name', 'LIKE', "%{$query}%");
                })
                ->with(['author' => function ($q) {
                    $q->select('id', 'name');
                }])
                ->with('thumbnail')
                ->withCount(['chapters as total_chapters'])
                ->withCount(['chapters as read_count' => function ($query) {
                    $query->select(DB::raw('SUM(read_count)'));
                }])
                ->where('status', 'published')
                ->limit(10)
                ->get();
        });

        return response()->json([
            'comics' => $comics
        ]);
    }

    /**
     * Lấy danh sách truyện được đề xuất dựa trên tag và truyện hiện tại
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecommendations(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'comic_id' => 'required|integer|exists:comics,id',
            'tag_ids' => 'nullable|string', // Comma-separated list of tag IDs
            'limit' => 'nullable|integer|min:1|max:10',
        ]);

        $comicId = $validated['comic_id'];
        $tagIds = !empty($validated['tag_ids']) ? explode(',', $validated['tag_ids']) : [];
        $limit = $validated['limit'] ?? 4;

        
        // Xóa cache trong môi trường phát triển để mỗi lần test đều chạy mới
        if (config('app.env') !== 'production') {
            $cacheKey = 'comic_recommendations_' . $comicId . '_' . implode('_', $tagIds) . '_' . $limit;
            Cache::forget($cacheKey);
            Log::info("Cache cleared for debugging");
        }
        
        // Cache kết quả trong 30 phút
        $cacheKey = 'comic_recommendations_' . $comicId . '_' . implode('_', $tagIds) . '_' . $limit;
        
        // Kiểm tra cache trước khi gọi remember để debug
        $isCached = Cache::has($cacheKey);
        Log::info("Is result cached? " . ($isCached ? "Yes" : "No"));
        
        $recommendations = Cache::remember($cacheKey, 30 * 60, function () use ($comicId, $tagIds, $limit) {

            // Lấy truyện được đề xuất dựa trên tags
            $query = Comic::where('id', '!=', $comicId)
                ->with(['author' => function ($query) {
                    $query->select('id', 'name');
                }])
                ->with('thumbnail')
                ->withCount(['chapters as read_count' => function ($query) {
                    $query->select(DB::raw('COALESCE(SUM(read_count), 0)'));
                }])
                ->withCount(['chapters as vote_count' => function ($query) {
                    $query->select(DB::raw('COALESCE(SUM(vote_count), 0)'));
                }]);


            // Nếu có tag_ids, ưu tiên truyện có cùng tag
            if (!empty($tagIds)) {
                $query->whereHas('tags', function ($query) use ($tagIds) {
                    $query->whereIn('tags.id', $tagIds);
                }, '>=', 1);
            }
            
            // Log query SQL để debug
            $sql = $query->toSql();
            $bindings = $query->getBindings();
            Log::info("SQL Query: " . $sql);
            Log::info("SQL Bindings: " . json_encode($bindings));
            
            // Sắp xếp theo truyện mới nhất và có nhiều lượt đọc nhất
            $recommendations = $query->orderByDesc('created_at')
                ->orderByDesc('read_count')
                ->limit($limit)
                ->get();
            
            
            // Nếu không đủ số lượng truyện đề xuất, bổ sung thêm truyện phổ biến
            if ($recommendations->count() < $limit) {
                
                $existingIds = $recommendations->pluck('id')->push($comicId)->toArray();
                $additionalComics = Comic::where('id', '!=', $comicId)
                    ->whereNotIn('id', $existingIds)
                    ->where('status', 'published')
                    ->with(['author' => function ($query) {
                        $query->select('id', 'name');
                    }])
                    ->with('thumbnail')
                    ->withCount(['chapters as read_count' => function ($query) {
                        $query->select(DB::raw('COALESCE(SUM(read_count), 0)'));
                    }])
                    ->withCount(['chapters as vote_count' => function ($query) {
                        $query->select(DB::raw('COALESCE(SUM(vote_count), 0)'));
                    }])
                    ->orderByDesc('read_count')
                    ->limit($limit - $recommendations->count())
                    ->get();

                Log::info("Additional comics count: " . $additionalComics->count());
                
                // Gộp kết quả
                $recommendations = $recommendations->concat($additionalComics);
            }

            // Thêm thông tin is_featured cho các truyện có nhiều lượt đọc
            $recommendations->each(function ($comic) {
                $comic->is_featured = $comic->read_count > 1000; // Truyện có trên 1000 lượt đọc là hot
                
                // Đảm bảo không có giá trị null trong các trường thống kê
                $comic->read_count = $comic->read_count ?? 0;
                $comic->vote_count = $comic->vote_count ?? 0;
            });

            Log::info("Final recommendations count: " . $recommendations->count());
            return $recommendations;
        });

        return response()->json($recommendations);
    }

    /**
     * Lấy danh sách truyện phổ biến
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPopular(Request $request)
    {
        $limit = $request->input('limit', 6);
        
        // Cache kết quả trong 1 giờ
        $cacheKey = 'popular_comics_' . $limit;
        
        // Xóa cache trong môi trường phát triển
        if (config('app.env') !== 'production') {
            Cache::forget($cacheKey);
        }
        
        $popularComics = Cache::remember($cacheKey, 60 * 60, function () use ($limit) {
            Log::info("Fetching popular comics");
            
            return Comic::where('status', 'published')
                ->with(['author' => function ($query) {
                    $query->select('id', 'name');
                }])
                ->with('thumbnail')
                ->withCount(['chapters as read_count' => function ($query) {
                    $query->select(DB::raw('COALESCE(SUM(read_count), 0)'));
                }])
                ->withCount(['chapters as vote_count' => function ($query) {
                    $query->select(DB::raw('COALESCE(SUM(vote_count), 0)'));
                }])
                ->orderByDesc('read_count')
                ->limit($limit)
                ->get();
        });
        
        return response()->json($popularComics);
    }

    /**
     * Lấy danh sách truyện mới cập nhật
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLatest(Request $request)
    {
        $limit = $request->input('limit', 6);
        
        // Cache kết quả trong 30 phút
        $cacheKey = 'latest_comics_' . $limit;
        
        // Xóa cache trong môi trường phát triển
        if (config('app.env') !== 'production') {
            Cache::forget($cacheKey);
        }
        
        $latestComics = Cache::remember($cacheKey, 30 * 60, function () use ($limit) {
            Log::info("Fetching latest comics");
            
            return Comic::where('status', 'published')
                ->with(['author' => function ($query) {
                    $query->select('id', 'name');
                }])
                ->with('thumbnail')
                ->withCount(['chapters as read_count' => function ($query) {
                    $query->select(DB::raw('COALESCE(SUM(read_count), 0)'));
                }])
                ->withCount(['chapters as latest_chapter' => function ($query) {
                    $query->select('order')->orderByDesc('order')->limit(1);
                }])
                ->orderByDesc('updated_at')
                ->limit($limit)
                ->get();
        });
        
        return response()->json($latestComics);
    }
}