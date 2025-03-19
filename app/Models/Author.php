<?php

namespace App\Models;

use App\Traits\HasMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasFactory, HasMedia;

    protected $fillable = [
        'name',
        'description',
        'stage_name',
    ];

    /**
     * Get the comics for the author.
     */
    public function comics(): HasMany
    {
        return $this->hasMany(Comic::class);
    }

     public function media()
    {
        return $this->morphMany(MediaItem::class, 'mediable')->orderBy('order');
    }
}
