<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Media;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
       $user = $request->user()->toArray();
        $avatar = User::find($user['id'])->with('avatar')->get();

        // dd($avatar);
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'test' => $avatar
        ]);
    }

    /**
     * Update the user's profile information.
     */
  public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'avatar' => ['nullable', 'image', 'max:1024'],
        ]);

        // Handle avatar upload and store in media table
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            
            // Generate a unique name
            $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $extension = $file->getClientOriginalExtension();
            // Store the file
            $path = $file->storeAs('avatars', $name, 'public');
            
            // Get file dimensions for images
            $width = null;
            $height = null;
            if (str_starts_with($file->getMimeType(), 'image/')) {
                list($width, $height) = getimagesize($file->getRealPath());
            }
            
            // Create media record with the correct fields based on your model
            $media = new Media();
            $media->name = $name;
            $media->path = $path;
            $media->type = $file->getMimeType();
            $media->size = $file->getSize();
            $media->alt = $user->name . ' avatar';
            $media->width = $width;
            $media->height = $height;
              $media->ext = $extension; 
            $media->save();

            $user->avatar = $media->id;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function logout(Request $request): RedirectResponse
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    
    return Redirect::to('/login');
}
    
}
