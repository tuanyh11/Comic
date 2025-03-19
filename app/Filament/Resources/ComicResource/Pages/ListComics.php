<?php

namespace App\Filament\Resources\ComicResource\Pages;

use App\Filament\Resources\ComicResource;
use BezhanSalleh\FilamentShield\Traits\HasPageShield;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListComics extends ListRecords
{
    protected static string $resource = ComicResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
