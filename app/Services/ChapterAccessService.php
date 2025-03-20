<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChapterAccessService
{
    /**
     * Get all access-related data for a chapter
     *
     * @param Chapter $chapter
     * @return array
     */
    public function getChapterAccessData(Chapter $chapter): array
    {
        // Default values
        $accessData = [
            'has_voted' => false,
            'is_paid_content' => $chapter->isPaidContent(),
            'is_unlocked' => false
        ];

        // If chapter is not paid content, mark as unlocked
        if (!$accessData['is_paid_content']) {
            $accessData['is_unlocked'] = true;
        }

        // If user is authenticated, check vote status and access permissions
        if (Auth::check()) {
            $user = Auth::user();
            $accessData['has_voted'] = $chapter->voters()->where('user_id', $user->id)->exists();

            // If it's paid content, check if user has purchased
            if ($accessData['is_paid_content']) {
                $accessData['is_unlocked'] = $this->isChapterAccessibleBy($user, $chapter);
            }
        }

        return $accessData;
    }

    /**
     * Check if user can access the chapter
     *
     * @param User $user
     * @param Chapter $chapter
     * @return bool
     */
    public function canUserAccessChapter(User $user, Chapter $chapter): bool
    {
        if (!$chapter->isPaidContent()) {
            return true;
        }
        
        return $this->isChapterAccessibleBy($user, $chapter);
    }

    /**
     * Check if chapter is accessible by user (purchased)
     *
     * @param User $user
     * @param Chapter $chapter
     * @return bool
     */
    public function isChapterAccessibleBy(User $user, Chapter $chapter): bool
    {
        // This method assumes Chapter model has an isAccessibleBy method
        // You can implement it directly here if needed
        return $chapter->isAccessibleBy($user);
    }
}