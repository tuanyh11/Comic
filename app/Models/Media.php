<?php

namespace App\Models;

use Awcodes\Curator\Models\Media as ModelsMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Media extends ModelsMedia
{
    protected static function boot()
    {
        parent::boot();


        static::creating(function (Media $media) {
            // Nếu không có mediable_type và mediable_id và có user đăng nhập
            if ((empty($media->mediable_type) || empty($media->mediable_id)) && Auth::check()) {
                $media->mediable_type = User::class;
                $media->mediable_id = Auth::id();
            }
        });

         static::saving(function (Media $media) {
            // Nếu không có mediable_type và mediable_id và có user đăng nhập
            if ((empty($media->mediable_type) || empty($media->mediable_id)) && Auth::check()) {
                $media->mediable_type = User::class;
                $media->mediable_id = Auth::id();
            }
        });
    }

    protected static function booted()
    {
        parent::booted();

        // Handle deleting media files from storage
        static::deleting(function (Media $media) {
            info("oke");
            Storage::disk('public')->delete($media->path);
        });

    }

    public function save(array $options = [])
    {
        if ((empty($this->mediable_type) || empty($this->mediable_id)) && Auth::check()) {
            $this->mediable_type = User::class;
            $this->mediable_id = Auth::id();
        }

        return parent::save($options);
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
