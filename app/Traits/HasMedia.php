<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;

trait HasMedia
{
    public function addMedia($file)
    {
        // Tạo thông tin file
        $fileName = $file->getClientOriginalName();
        $filePath = $file->store('media', 'public');
        
        // Tạo bản ghi media mới
        return $this->media()->create([
            'name' => pathinfo($fileName, PATHINFO_FILENAME),
            'file_name' => $fileName,
            'mime_type' => $file->getClientMimeType(),
            'path' => $filePath,
            'disk' => 'public',
            'file_hash' => hash_file('md5', $file->getRealPath()),
            'size' => $file->getSize(),
        ]);
    }
    
    /**
     * Xóa một media.
     */
    public function deleteMedia($mediaId)
    {
        $media = $this->media()->findOrFail($mediaId);
        
        // Xóa file từ storage
        Storage::disk($media->disk)->delete($media->path);
        
        // Xóa bản ghi từ database
        return $media->delete();
    }
}
