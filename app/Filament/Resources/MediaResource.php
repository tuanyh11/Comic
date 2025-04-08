<?php

namespace App\Filament\Resources;
use App\Lang\Traits\HasTranslate;
use Awcodes\Curator\Resources\MediaResource as ResourcesMediaResource;

class MediaResource extends ResourcesMediaResource
{
    use HasTranslate;
    protected static function getLabelName(): string
    {
        return __('Media');
    }


    public static function getPluralModelLabel(): string
    {
        return __("Media");
    }


    public static function getModelLabel(): string
    {
        return __('Media');
    }

  
    // public static function getPages(): array
    // {
    //     return [
    //         'index' => MediaResource\Pages\ListMedia::route('/'),
    //         // 'create' => MediaResource\CreateMedia::route('/create'),
    //         // 'edit' => MediaResource\EditMedia::route('/{record}/edit'),
    //     ];
    // }
}
