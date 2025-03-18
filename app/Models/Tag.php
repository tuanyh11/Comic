<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * Get comics that belong to this tag
     */
    public function comics(): BelongsToMany
    {
        return $this->belongsToMany(Comic::class, 'comic_tags');
    }
}