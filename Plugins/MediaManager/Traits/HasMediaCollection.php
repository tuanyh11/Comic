<?php

namespace Plugins\MediaManager\Traits;

use App\Models\Media;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Http\UploadedFile;
use Plugins\MediaManager\MediaManager;

trait HasMediaCollection
{
    /**
     * Define media relationship.
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Add media to this model.
     */
    public function addMedia(UploadedFile $file): Media
    {
        return app(MediaManager::class)->upload($file, $this);
    }

    /**
     * Add multiple media to this model.
     */
    public function addMediaMany(array $files): array
    {
        $mediaItems = [];

        foreach ($files as $file) {
            $mediaItems[] = $this->addMedia($file);
        }

        return $mediaItems;
    }

    /**
     * Delete a media item.
     */
    public function deleteMedia(int $mediaId): bool
    {
        $media = $this->media()->findOrFail($mediaId);
        return app(MediaManager::class)->delete($media);
    }

    /**
     * Delete all media items.
     */
    public function clearMedia(): void
    {
        $mediaManager = app(MediaManager::class);
        
        $this->media()->each(function ($media) use ($mediaManager) {
            $mediaManager->delete($media);
        });
    }

    /**
     * Sync media by IDs.
     */
    public function syncMedia(array $mediaIds): void
    {
        $this->media()->whereNotIn('id', $mediaIds)->get()->each(function($media) {
            app(MediaManager::class)->delete($media);
        });

        // Attach media that's not already attached
        $existingIds = $this->media()->pluck('id')->toArray();
        $newIds = array_diff($mediaIds, $existingIds);

        foreach ($newIds as $id) {
            $media = Media::find($id);
            if ($media) {
                $media->mediable_id = $this->id;
                $media->mediable_type = get_class($this);
                $media->save();
            }
        }
    }

    /**
     * Get all media by type.
     */
    public function getMediaByType(string $type): \Illuminate\Database\Eloquent\Collection
    {
        return $this->media()->where('mime_type', 'like', $type . '%')->get();
    }

    /**
     * Get the first media item.
     */
    public function getFirstMedia(): ?Media
    {
        return $this->media()->first();
    }

    /**
     * Get the first media URL.
     */
    public function getFirstMediaUrl(): ?string
    {
        $media = $this->getFirstMedia();
        
        if (!$media) {
            return null;
        }
        
        return app(MediaManager::class)->getUrl($media);
    }

    /**
     * Get the first media thumbnail URL (for images only).
     */
    public function getFirstMediaThumbnailUrl(): ?string
    {
        $media = $this->getFirstMedia();
        
        if (!$media || !str_starts_with($media->mime_type, 'image/')) {
            return null;
        }
        
        return app(MediaManager::class)->getThumbnailUrl($media);
    }
}