<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\User;

class VoteService
{
    /**
     * Toggle vote for a chapter
     *
     * @param User $user
     * @param Chapter $chapter
     * @return array Response data with message, voted status, and vote count
     */
    public function toggleVote(User $user, Chapter $chapter): array
    {
        // Check if user has already voted
        $hasVoted = $chapter->voters()->where('user_id', $user->id)->exists();

        if ($hasVoted) {
            // If already voted, remove vote
            $chapter->voters()->detach($user->id);
            $chapter->decrement('vote_count');
            $message = 'Đã hủy vote thành công';
            $voted = false;
        } else {
            // If not voted yet, add vote
            $chapter->voters()->attach($user->id);
            $chapter->increment('vote_count');
            $message = 'Đã vote thành công';
            $voted = true;
        }

        return [
            'message' => $message,
            'voted' => $voted,
            'vote_count' => $chapter->vote_count
        ];
    }

    /**
     * Check if user has voted for a chapter
     *
     * @param User $user
     * @param Chapter $chapter
     * @return bool
     */
    public function hasUserVoted(User $user, Chapter $chapter): bool
    {
        return $chapter->voters()->where('user_id', $user->id)->exists();
    }
}