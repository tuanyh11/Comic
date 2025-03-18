<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chapter extends Model
{
    protected $fillable = [
        'title',
        'order',
        'description',
        'comic_id',
        'media_id',
        'vote_count',
        'read_count',
        'pricing' // Thêm trường pricing vào danh sách fillable
    ];

    public function comic()
    {
        return $this->belongsTo(Comic::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function voters(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'chapter_user_votes')
            ->withTimestamps();
    }

    // To check if a specific user has voted
    public function hasUserVoted(User $user): bool
    {
        return $this->voters()->where('user_id', $user->id)->exists();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the users who purchased this chapter.
     */
    public function purchasedBy(): HasMany
    {
        return $this->hasMany(PurchasedChapter::class);
    }

    /**
     * Check if the chapter is paid content.
     */
    public function isPaidContent(): bool
    {
        return $this->pricing > 0;
    }

    /**
     * Check if user has access to this chapter
     */
    public function isAccessibleBy(User $user): bool
    {
        // Nếu chapter miễn phí, trả về true
        if (!$this->isPaidContent()) {
            return true;
        }

        // Kiểm tra xem user đã mua chapter này chưa
        return $this->purchasedBy()->where('user_id', $user->id)->exists();
    }

    public function media() {
        return $this->morphOne(Media::class, 'mediable');
    }

    public function readers()
    {
        return $this->hasMany(ReadHistory::class);
    }
 }
