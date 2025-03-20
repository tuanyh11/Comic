<?php

namespace App\Services;

use App\Models\Media;
use App\Models\MediaItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    /**
     * Update the user's avatar from a uploaded file
     */
    public function updateUserAvatar(Request $request, User $user): void
    {
        $file = $request->file('avatar');
        
        // Generate a unique name
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $extension = $file->getClientOriginalExtension();
        
        // Store the file
        $path = $file->storeAs('avatars', $name, 'public');
        
        // Create media record
        $media = $this->createMediaRecordFromUpload($file, $path, $name, $extension, $user->name);
        
        // Remove previous avatar if exists
        $user->media()->delete();
        
        // Create and attach new media item
        $this->attachMediaToUser($media, $user);
    }
    
    /**
     * Update the user's avatar from a URL (for social login)
     */
    public function updateUserAvatarFromUrl(string $avatarUrl, User $user): bool
    {
        try {
            // Download the image content
            $imageContent = file_get_contents($avatarUrl);
            if (!$imageContent) {
                Log::error("Failed to download avatar from URL for user {$user->id}");
                return false;
            }

            // Get image info
            $imageInfo = getimagesizefromstring($imageContent);
            if (!$imageInfo) {
                Log::error("Failed to get image info from downloaded avatar for user {$user->id}");
                return false;
            }

            // Determine file extension based on mime type
            $mimeType = $imageInfo['mime'];
            $extension = explode('/', $mimeType)[1];
            
            // Generate a unique filename
            $filename = 'social_avatar_' . $user->id . '_' . Str::uuid() . '.' . $extension;
            
            // Save the file to storage
            $path = 'avatars/' . $filename;
            Storage::disk('public')->put($path, $imageContent);
            
            // Remove user's previous avatar if exists
            $user->media()->delete();
            
            // Create media record
            $media = $this->createMediaRecordFromUrlImage(
                $mimeType, 
                $path, 
                $filename, 
                $extension, 
                $user->name, 
                strlen($imageContent), 
                $imageInfo[0], 
                $imageInfo[1]
            );
            
            // Create and attach new media item
            $this->attachMediaToUser($media, $user);
            
            Log::info("Successfully saved avatar from URL for user {$user->id}");
            return true;
        } catch (\Exception $e) {
            Log::error("Error saving avatar from URL: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create a new media record from uploaded file
     */
    private function createMediaRecordFromUpload($file, string $path, string $name, string $extension, string $userName): Media
    {
        // Get file dimensions for images
        $width = null;
        $height = null;
        if (str_starts_with($file->getMimeType(), 'image/')) {
            list($width, $height) = getimagesize($file->getRealPath());
        }
        
        // Create media record with the correct fields
        $media = new Media();
        $media->name = $name;
        $media->path = $path;
        $media->type = $file->getMimeType();
        $media->size = $file->getSize();
        $media->alt = $userName . ' avatar';
        $media->width = $width;
        $media->height = $height;
        $media->ext = $extension; 
        $media->save();
        
        return $media;
    }
    
    /**
     * Create a new media record from URL image
     */
    private function createMediaRecordFromUrlImage(
        string $mimeType, 
        string $path, 
        string $name, 
        string $extension, 
        string $userName, 
        int $size, 
        int $width, 
        int $height
    ): Media {
        // Create media record with the correct fields
        $media = new Media();
        $media->name = $name;
        $media->path = $path;
        $media->type = $mimeType;
        $media->size = $size;
        $media->alt = $userName . ' avatar';
        $media->width = $width;
        $media->height = $height;
        $media->ext = $extension; 
        $media->save();
        
        return $media;
    }
    
    /**
     * Attach media to user
     */
    public function attachMediaToUser(Media $media, User $user, string $type = 'avatar', int $order = 1): void
    {
        $mediaItem = new MediaItem();
        $mediaItem->media_id = $media->id;
        $mediaItem->mediable_id = $user->id;
        $mediaItem->mediable_type = User::class;
        $mediaItem->order = $order;
        $mediaItem->type = $type;
        $mediaItem->save();
    }
}