<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchasedChapter extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'chapter_id',
        'price_paid',
        'payment_id',
    ];

    protected $casts = [
        'price_paid' => 'decimal:2',
    ];

    /**
     * Get the user who purchased this chapter.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the purchased chapter.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }
}