<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProfileService
{
    /**
     * The media service instance.
     */
    protected $mediaService;

    /**
     * Create a new service instance.
     */
    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

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
            $this->mediaService->updateUserAvatar($request, $user);
        }
        
        // Update user basic information
        $this->updateUserInformation($user, $validated);
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
    
    /**
     * Create or update user from social login
     */
    public function handleSocialLogin(string $socialId, string $name, string $email, ?string $avatarUrl = null): User
    {
        // Check if user already exists by email or social_id
        $user = User::where('email', $email)
            ->orWhere('google_id', $socialId)
            ->first();

        // If user doesn't exist, create a new one
        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $socialId,
                'password' => Hash::make(Str::random(16)), // Random secure password
            ]);

            // Create a wallet for the new user if needed
            if (method_exists($user, 'wallet') && !$user->wallet) {
                $user->wallet()->create([
                    'balance' => 0,
                ]);
            }
        } else if (!$user->google_id) {
            // If user exists by email but no Google ID, update it
            $user->google_id = $socialId;
            $user->save();
        }

        // Add social avatar if provided and user doesn't have one
        if ($avatarUrl && !$user->avatar) {
            $this->mediaService->updateUserAvatarFromUrl($avatarUrl, $user);
        }

        return $user;
    }
}