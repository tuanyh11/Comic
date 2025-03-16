<?php

namespace Plugins\MediaManager\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Plugins\MediaManager\MediaManager;

class MediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $mediaManager = app(MediaManager::class);
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'human_readable_size' => $this->getHumanReadableSize(),
            'url' => $mediaManager->getUrl($this->resource),
            'thumbnail_url' => $mediaManager->getThumbnailUrl($this->resource),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
    
    /**
     * Get human readable file size.
     */
    protected function getHumanReadableSize(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
    
        $bytes /= (1 << (10 * $pow));
    
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}