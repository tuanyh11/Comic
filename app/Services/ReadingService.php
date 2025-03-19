<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\Comic;
use App\Models\ReadHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReadingService
{
    /**
     * Ghi lại một lượt đọc và tăng số đếm
     */
    public function recordReading(User $user, Chapter $chapter): void
    {
        $comicId = $chapter->comic_id;

        // Kiểm tra xem người dùng đã có bản ghi đọc chương này chưa
        $existingRecord = ReadHistory::where('user_id', $user->id)
            ->where('chapter_id', $chapter->id)
            ->first();

        $now = Carbon::now();
        
        // Nếu chưa có bản ghi hoặc bản ghi cũ hơn 1 giờ, tăng lượt đọc
        $shouldIncrementCount = !$existingRecord || 
            $existingRecord->last_read_at->diffInHours($now) >= 1;
        
        DB::transaction(function () use ($user, $chapter, $comicId, $existingRecord, $now, $shouldIncrementCount) {
            // Cập nhật hoặc tạo mới bản ghi đọc
            if ($existingRecord) {
                $existingRecord->update(['last_read_at' => $now]);
            } else {
                ReadHistory::create([
                    'user_id' => $user->id,
                    'chapter_id' => $chapter->id,
                    'comic_id' => $comicId,
                    'last_read_at' => $now
                ]);
            }

            // Tăng lượt đọc chỉ khi thỏa mãn điều kiện
            if ($shouldIncrementCount) {
                $chapter->increment('read_count');
                
                // Cập nhật tổng lượt đọc của comic
                // $comic = Comic::find($comicId);
                // $comic->increment('read_count');
            }
        });
    }

    /**
     * Lấy số lượng người dùng duy nhất đã đọc một chương
     */
    public function getUniqueReadersCount(Chapter $chapter): int
    {
        return ReadHistory::where('chapter_id', $chapter->id)
            ->distinct('user_id')
            ->count('user_id');
    }

    /**
     * Lấy các chương đã đọc của người dùng cho một truyện
     */
    public function getReadChapters(User $user, Comic $comic): array
    {
        return ReadHistory::where('user_id', $user->id)
            ->where('comic_id', $comic->id)
            ->pluck('chapter_id')
            ->toArray();
    }
    
    /**
     * Kiểm tra xem người dùng đã đọc chương này chưa
     */
    public function hasReadChapter(User $user, Chapter $chapter): bool
    {
        return ReadHistory::where('user_id', $user->id)
            ->where('chapter_id', $chapter->id)
            ->exists();
    }
}