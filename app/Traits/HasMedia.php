<?php

namespace App\Traits;

use App\Models\Media;

trait HasMedia
{
    public function media() {
        return $this->morphOne(Media::class, 'mediable');
    }
}
