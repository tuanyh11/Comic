<?php

namespace App\Models;

use App\Traits\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Genre extends Model
{
    use HasMedia;
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Get comics that belong to this genre
     */
    public function comics(): BelongsToMany
    {
        return $this->belongsToMany(Comic::class, 'comic_genres');
    }
}