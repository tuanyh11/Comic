<?php

namespace Plugins\MediaManager\Pages\MediaResourcePages;

use Filament\Pages\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Livewire\WithFileUploads;
use Plugins\MediaManager\Pages\MediaResource;
use Plugins\MediaManager\MediaManager;

class ListMedia extends ListRecords
{
    use WithFileUploads;
    
    protected static string $resource = MediaResource::class;
    
    public $upload = [];
    
    public $isUploadModalOpen = false;
    
    protected function getActions(): array
    {
        return [
            Action::make('upload')
                ->label('Upload Media')
                ->icon('heroicon-o-upload')
                ->action(function () {
                    $this->isUploadModalOpen = true;
                }),
        ];
    }
    
    public function updatedUpload()
    {
        $this->validate([
            'upload.*' => 'file|max:' . (config('media-manager.max_file_size') / 1024),
        ]);
    }
    
    public function uploadMedia()
    {
        $this->validate([
            'upload.*' => 'file|max:' . (config('media-manager.max_file_size') / 1024),
        ]);
        
        $mediaManager = app(MediaManager::class);
        
        foreach ($this->upload as $file) {
            $mediaManager->upload($file);
        }
        
        $this->upload = [];
        $this->isUploadModalOpen = false;
        
        $this->notify('success', 'Files uploaded successfully.');
        $this->refreshTable();
    }
    
    public function closeUploadModal()
    {
        $this->isUploadModalOpen = false;
        $this->upload = [];
    }
    
    public function getListeners()
    {
        return [
            'refreshTable' => '$refresh',
        ];
    }
}