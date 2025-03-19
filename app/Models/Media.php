<?php

namespace App\Models;

use Awcodes\Curator\Models\Media as ModelsMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Media extends ModelsMedia
{

    protected static function booted()
    {
        parent::booted();

        // Handle deleting media files from storage
        static::deleting(function (Media $media) {
            info("oke");
            Storage::disk('public')->delete($media->path);
        });

    }

 

  
}
