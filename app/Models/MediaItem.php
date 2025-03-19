<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    protected $fillable = [
        'media_id',
        'order',
        'type'
    ];

    public function author() {
        return $this->morphTo();
    }

    public function comic() {
        return $this->morphTo();
    }

    public function media() {
        return $this->belongsTo(Media::class);
    }
}
