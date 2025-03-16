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
        // Handle deleting media files from storage
        static::deleting(function (Media $media) {
            Storage::disk('public')->delete($media->path);
        });

        // Set default user as mediable when not specified
        static::creating(function (Media $media) {
            // Nếu không có mediable_type và mediable_id và có user đăng nhập
            if ((empty($media->mediable_type) || empty($media->mediable_id)) && Auth::check()) {
                $media->mediable_type = User::class;
                $media->mediable_id = Auth::id();
            }
        });
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
