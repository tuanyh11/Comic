<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'chapter_id',
        'transaction_id',
        'payment_method',
        'amount',
        'currency',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the user who made this payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the chapter that was purchased.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }
}