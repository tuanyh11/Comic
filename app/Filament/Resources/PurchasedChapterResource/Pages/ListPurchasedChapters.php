<?php

namespace App\Filament\Resources\PurchasedChapterResource\Pages;

use App\Filament\Resources\PurchasedChapterResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPurchasedChapters extends ListRecords
{
    protected static string $resource = PurchasedChapterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
