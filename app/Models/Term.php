<?php

namespace App\Models;

use App\Traits\HasMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Term extends Model
{
    use HasFactory, HasMedia;

    protected $fillable = [
        'title',
        'content',
        'type',
        'is_active',
        'published_at',
        'version',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'version' => 'integer',
    ];

    /**
     * Scope a query to only include active terms.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to get the latest version of a specific type.
     */
    public function scopeLatestOfType($query, $type)
    {
        return $query->where('type', $type)
            ->where('is_active', true)
            ->orderBy('version', 'desc')
            ->limit(1);
    }

    /**
     * Get the latest terms of service.
     */
    public static function getLatestTermsOfService()
    {
        return self::latestOfType('terms_of_service')->first();
    }

    /**
     * Get the latest privacy policy.
     */
    public static function getLatestPrivacyPolicy()
    {
        return self::latestOfType('privacy_policy')->first();
    }
}