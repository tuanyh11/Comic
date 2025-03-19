<?php

namespace App\Http\Middleware;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */

    
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if($request->user()) {
            $request->user()->load('avatar');
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'wallet' => function () use ($request) {
                if (!$request->user()) {
                    return null;
                }
                
                $wallet = Wallet::where('user_id', $request->user()->id)->first();
                
                if (!$wallet) {
                    return [
                        'balance' => '0',
                        'currency' => 'VND',
                    ];
                }
                return [
                    'balance' => number_format($wallet->balance, 0),
                    'currency' => $wallet->currency,
                ];
            },
            
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
