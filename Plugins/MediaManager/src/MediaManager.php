<?php

namespace Plugins\MediaManager;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class MediaManager
{
    /**
     * Upload một file media mới.
     */
    public function upload(UploadedFile $file, $model = null)
    {
        // Kiểm tra mime type cho phép
        $this->validateFile($file);

        // Lưu file vào storage
        $fileName = $this->generateFileName($file);
        $filePath = $file->storeAs(
            config('media-manager.directory'),
            $fileName,
            config('media-manager.disk')
        );

        // Tạo thumbnail nếu là hình ảnh
        $thumbnailPath = null;
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $thumbnailPath = $this->createThumbnail($file, $fileName);
        }

        // Tạo bản ghi media
        $media = new Media([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'file_name' => $fileName,
            'mime_type' => $file->getMimeType(),
            'path' => $filePath,
            'disk' => config('media-manager.disk'),
            'file_hash' => hash_file('md5', $file->getRealPath()),
            'size' => $file->getSize(),
        ]);

        // Nếu có mô hình liên kết, gán media vào mô hình đó
        if ($model) {
            $model->media()->save($media);
        } else {
            $media->save();
        }

        return $media;
    }

    /**
     * Xóa một media.
     */
    public function delete(Media $media)
    {
        // Xóa file từ storage
        Storage::disk($media->disk)->delete($media->path);

        // Xóa thumbnail nếu có
        $thumbnailPath = $this->getThumbnailPath($media->path);
        if (Storage::disk($media->disk)->exists($thumbnailPath)) {
            Storage::disk($media->disk)->delete($thumbnailPath);
        }

        // Xóa bản ghi từ database
        return $media->delete();
    }

    /**
     * Tạo thumbnail cho hình ảnh.
     */
    protected function createThumbnail(UploadedFile $file, string $fileName): string
    {
        $config = config('media-manager.thumbnails');
        $thumbnailName = 'thumb_' . $fileName;
        $thumbnailPath = config('media-manager.directory') . '/thumbnails/' . $thumbnailName;

        // Tạo thư mục thumbnails nếu chưa tồn tại
        $disk = config('media-manager.disk');
        $thumbnailDir = config('media-manager.directory') . '/thumbnails';
        if (!Storage::disk($disk)->exists($thumbnailDir)) {
            Storage::disk($disk)->makeDirectory($thumbnailDir);
        }

        // Tạo và lưu thumbnail
        $image = Image::make($file->getRealPath());
        
        switch ($config['fit']) {
            case 'contain':
                $image->resize($config['width'], $config['height'], function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                break;
            case 'crop':
                $image->fit($config['width'], $config['height']);
                break;
            case 'max':
                $image->resize($config['width'], $config['height'], function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                break;
            // Thêm các trường hợp khác tại đây...
        }

        $thumbnailContent = $image->encode();
        Storage::disk($disk)->put($thumbnailPath, $thumbnailContent);

        return $thumbnailPath;
    }

    /**
     * Lấy đường dẫn thumbnail từ đường dẫn file gốc.
     */
    public function getThumbnailPath(string $originalPath): string
    {
        $pathInfo = pathinfo($originalPath);
        return $pathInfo['dirname'] . '/thumbnails/thumb_' . $pathInfo['basename'];
    }

    /**
     * Tạo tên file duy nhất.
     */
    protected function generateFileName(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $name = str_slug($name);
        
        return $name . '_' . time() . '_' . uniqid() . '.' . $extension;
    }

    /**
     * Kiểm tra tính hợp lệ của file.
     */
    protected function validateFile(UploadedFile $file)
    {
        $allowedTypes = config('media-manager.allowed_file_types');
        $maxSize = config('media-manager.max_file_size');

        if (!in_array($file->getMimeType(), $allowedTypes)) {
            throw new \Exception('File type not allowed: ' . $file->getMimeType());
        }

        if ($file->getSize() > $maxSize) {
            throw new \Exception('File size exceeds maximum allowed: ' . $maxSize . ' bytes');
        }
    }

    /**
     * Lấy URL công khai của media.
     */
    public function getUrl(Media $media): string
    {
        return Storage::disk($media->disk)->url($media->path);
    }

    /**
     * Lấy URL của thumbnail.
     */
    public function getThumbnailUrl(Media $media): ?string
    {
        if (!str_starts_with($media->mime_type, 'image/')) {
            return null;
        }

        $thumbnailPath = $this->getThumbnailPath($media->path);
        
        if (!Storage::disk($media->disk)->exists($thumbnailPath)) {
            return null;
        }
        
        return Storage::disk($media->disk)->url($thumbnailPath);
    }
}