<?php

namespace App\Traits;

use App\Models\Media;
use App\Models\MediaItem;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasMedia 
{
    public function media()
    {
          return $this->morphMany(MediaItem::class, 'mediable')->orderBy('order');
    }

    public function getThumbnailUrlAttribute()
    {
        $mediaItem = $this->media()->first();
        if ($mediaItem && $mediaItem->media) {
            return $mediaItem->media->url;
        }
        return null;
    }
}


