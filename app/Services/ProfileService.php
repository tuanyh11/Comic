<?php

namespace App\Services;

use App\Models\Media;
use App\Models\MediaItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProfileService
{
    /**
     * Validate profile update data
     */
    public function validateProfileData(Request $request, User $user): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($user->id)
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'avatar' => ['nullable', 'image', 'max:1024'],
        ]);
    }
    
    /**
     * Update user's profile information
     */
    public function updateProfile(Request $request, User $user): void
    {
        $validated = $this->validateProfileData($request, $user);
        
        // Handle avatar upload if present
        if ($request->hasFile('avatar')) {
            $this->updateUserAvatar($request, $user);
        }
        
        // Update user basic information
        $this->updateUserInformation($user, $validated);
    }
    
    /**
     * Update the user's avatar
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
        $media = $this->createMediaRecord($file, $path, $name, $extension, $user->name);
        
        // Remove previous avatar if exists
        $user->media()->delete();
        
        // Create and attach new media item
        $this->attachMediaToUser($media, $user);
    }
    
    /**
     * Create a new media record
     */
    private function createMediaRecord($file, string $path, string $name, string $extension, string $userName): Media
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
     * Attach media to user
     */
    private function attachMediaToUser(Media $media, User $user): void
    {
        $mediaItem = new MediaItem();
        $mediaItem->media_id = $media->id;
        $mediaItem->mediable_id = $user->id;
        $mediaItem->mediable_type = User::class;
        $mediaItem->order = 1; // First/primary media item
        $mediaItem->type = 'avatar'; // Set the type column to 'avatar'
        $mediaItem->save();
    }
    
    /**
     * Update user basic information
     */
    public function updateUserInformation(User $user, array $validated): void
    {
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        
        $user->save();
    }
}