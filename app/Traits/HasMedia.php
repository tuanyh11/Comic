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
}


