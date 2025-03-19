<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user already exists by email or google_id
            $user = User::where('email', $googleUser->getEmail())
                        ->orWhere('google_id', $googleUser->getId())
                        ->first();

            // If user doesn't exist, create a new one
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => Hash::make(Str::random(16)), // Random secure password as they'll login via Google
                    // 'avatar' => $googleUser->getAvatar(), // Uncomment if you want to use Google's avatar
                ]);

                // Create a wallet for the new user if needed (if your app uses wallets)
                if (method_exists($user, 'wallet') && !$user->wallet) {
                    $user->wallet()->create([
                        'balance' => 0,
                    ]);
                }

                // Fire registered event
                event(new Registered($user));
            }

            // Login the user
            Auth::login($user);

            // Generate a new session
            request()->session()->regenerate();

            // Redirect to the intended page or dashboard
            return redirect()->intended(route('home', absolute: false));
            
        } catch (Exception $e) {
            // Log the error and redirect back with an error message
            Log::error('Google login error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Đăng nhập Google không thành công. Vui lòng thử lại sau.');
        }
    }
}