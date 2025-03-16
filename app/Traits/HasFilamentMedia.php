<?php

namespace App\Traits;

use App\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HasFilamentMedia
{
    /**
     * Boot the trait.
     */
    public static function bootHasFilamentMedia(): void
    {
        static::deleting(function (Model $model) {
            // Nếu model bị xóa, xóa tất cả các media liên quan
            if (method_exists($model, 'isForceDeleting') && ! $model->isForceDeleting()) {
                return;
            }

            $model->media->each(function (Media $media) {
                $media->delete();
            });
        });
    }

    /**
     * Lấy tất cả media liên quan đến model này.
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Thêm một media mới.
     *
     * @param UploadedFile $file
     * @param string|null $collection Tùy chọn xác định nhóm media
     * @return Media
     */
    public function addMedia(UploadedFile $file, ?string $collection = null): Media
    {
        // Tạo thông tin file
        $fileName = $file->getClientOriginalName();
        $filePath = $file->store('media', 'public');
        
        // Tạo bản ghi media mới
        $media = $this->media()->create([
            'name' => pathinfo($fileName, PATHINFO_FILENAME),
            'file_name' => $fileName,
            'mime_type' => $file->getClientMimeType(),
            'path' => $filePath,
            'disk' => 'public',
            'file_hash' => hash_file('md5', $file->getRealPath()),
            'size' => $file->getSize(),
            'collection' => $collection,
        ]);

        return $media;
    }
    
    /**
     * Thêm nhiều media cùng lúc.
     *
     * @param array $files
     * @param string|null $collection Tùy chọn xác định nhóm media
     * @return \Illuminate\Support\Collection
     */
    public function addMultipleMedia(array $files, ?string $collection = null)
    {
        $mediaItems = collect();
        
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $mediaItems->push($this->addMedia($file, $collection));
            }
        }
        
        return $mediaItems;
    }

    /**
     * Xóa một media.
     *
     * @param int $mediaId
     * @return bool
     */
    public function deleteMedia(int $mediaId): bool
    {
        $media = $this->media()->findOrFail($mediaId);
        
        // Xóa file từ storage
        Storage::disk($media->disk)->delete($media->path);
        
        // Xóa bản ghi từ database
        return $media->delete();
    }
    
    /**
     * Lấy media theo collection.
     *
     * @param string|null $collection
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMedia(?string $collection = null)
    {
        $query = $this->media();
        
        if ($collection !== null) {
            $query->where('collection', $collection);
        }
        
        return $query->get();
    }
    
    /**
     * Lấy media đầu tiên theo collection.
     *
     * @param string|null $collection
     * @return Media|null
     */
    public function getFirstMedia(?string $collection = null): ?Media
    {
        $query = $this->media();
        
        if ($collection !== null) {
            $query->where('collection', $collection);
        }
        
        return $query->first();
    }
}