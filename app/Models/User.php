<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasMedia;
use BezhanSalleh\FilamentShield\Support\Utils;
use BezhanSalleh\FilamentShield\Traits\HasPanelShield;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use TomatoPHP\FilamentMediaManager\Traits\InteractsWithMediaFolders;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasMedia, HasRoles, HasPanelShield;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected $appends = ['avatar'];

    public function getAvatarAttribute(): ?string
    {
        $mediaItem = $this->media()->where('type', 'avatar')->orderBy('order')->first();
        
        if ($mediaItem && $mediaItem->media) {
            return $mediaItem->media->url;
        }
        
        return null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Get the payments made by the user.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the wallet transactions made by the user.
     */
    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    /**
     * Get the chapters purchased by the user.
     */
    public function purchasedChapters(): HasMany
    {
        return $this->hasMany(PurchasedChapter::class);
    }

    /**
     * Check if the user has purchased a specific chapter.
     */
    public function hasPurchased(Chapter $chapter): bool
    {
        return $this->purchasedChapters()
            ->where('chapter_id', $chapter->id)
            ->exists();
    }

    // app/Models/Comic.php
    public function readHistories()
    {
        return $this->hasMany(ReadHistory::class);
    }

    public function notifications()
{
    return $this->morphMany(\Illuminate\Notifications\DatabaseNotification::class, 'notifiable')
                ->orderBy('created_at', 'desc');
}
}
