<?php

namespace Plugins\MediaManager;

use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use Livewire\Livewire;
use Plugins\MediaManager\Components\MediaPicker;
use Plugins\MediaManager\Components\MediaUploader;

class MediaManagerServiceProvider extends PackageServiceProvider
{
    public static string $name = 'media-manager';

    public function configurePackage(Package $package): void
    {
        $package
            ->name(static::$name)
            ->hasConfigFile()
            ->hasViews()
            ->hasTranslations()
            ->hasMigrations(['create_media_manager_table'])
            ->hasRoute('web');
    }

    public function packageRegistered(): void
    {
        $this->app->singleton(MediaManager::class, fn () => new MediaManager());
    }

    public function packageBooted(): void
    {
        // Đăng ký components cho Livewire
        Livewire::component('media-picker', MediaPicker::class);
        Livewire::component('media-uploader', MediaUploader::class);
        
        // Load assets
        FilamentAsset::register([
            Css::make('media-manager-styles', __DIR__ . '/../resources/css/media-manager.css'),
            Js::make('media-manager-scripts', __DIR__ . '/../resources/js/media-manager.js'),
        ], 'plugins/media-manager');
    }
}