<?php

namespace App\Filament\Resources\ComicResource\Pages;

use App\Filament\Resources\ComicResource;
use App\Models\Chapter;
use Filament\Actions;
use Filament\Actions\Concerns\HasWizard;
use Filament\Forms\Components\Wizard\Step;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateComic extends CreateRecord
{
    // use HasWizard;
    protected static string $resource = ComicResource::class;
    
    // protected function getRedirectUrl(): string
    // {
    //     return $this->getResource()::getUrl('index');
    // }

    // protected function getSteps(): array
    // {
    //     return [
    //         Step::make('Comic Info')->schema([
    //             ComicResource::formSchema()
    //         ]),
    //         Step::make('Chapter Info')->schema([
    //             Chapter::formSchema()
    //         ])
    //     ];
    // }
}