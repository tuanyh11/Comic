<?php

namespace App\Filament\Resources\MediaResource\Pages;

use App\Filament\Resources\MediaResource;
use Awcodes\Curator\Resources\MediaResource as ResourcesMediaResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMedia extends ResourcesMediaResource\ListMedia
{
    protected static string $resource = MediaResource::class;

    // protected function getHeaderActions(): array
    // {
    //     return [
    //         Actions\CreateAction::make(),
    //     ];
    // }

    // public function getTitle(): string
    // {
    //     return __('Media');
    // }

    // public function getHeaderActions(): array
    // {
    //     return [
    //         Actions\CreateAction::make()
    //             ->label(__('Add Media'))
    //             ->icon('heroicon-o-plus')
    //             ->color('primary')
    //             ->form([
    //                 Actions\MultiUploadAction::make(),
    //             ])
    //             ->modalHeading(__('Add Media')),
    //     ];
    // }
}
