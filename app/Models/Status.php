<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'color',
        'description',
        'is_default',
    ];

    /**
     * Get comics that have this status.
     */
    public function comics(): HasMany
    {
        return $this->hasMany(Comic::class);
    }
}