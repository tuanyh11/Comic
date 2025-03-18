<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    public function media() {
        return $this->morphOne(Media::class, 'mediable');
    }
}
