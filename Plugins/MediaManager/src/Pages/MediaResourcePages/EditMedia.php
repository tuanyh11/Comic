<?php

namespace Plugins\MediaManager\Pages\MediaResourcePages;

use Filament\Pages\Actions\Action;
use Filament\Pages\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Plugins\MediaManager\Pages\MediaResource;
use Plugins\MediaManager\MediaManager;

class EditMedia extends EditRecord
{
    protected static string $resource = MediaResource::class;
    
    protected function getActions(): array
    {
        return [
            Action::make('view')
                ->label('View Media')
                ->icon('heroicon-o-eye')
                ->url(fn () => app(MediaManager::class)->getUrl($this->record))
                ->openUrlInNewTab(),
            Action::make('download')
                ->label('Download Media')
                ->icon('heroicon-o-download')
                ->url(fn () => app(MediaManager::class)->getUrl($this->record))
                ->openUrlInNewTab(),
            DeleteAction::make()
                ->action(function () {
                    app(MediaManager::class)->delete($this->record);
                    $this->redirect(static::getResource()::getUrl('index'));
                }),
        ];
    }
}