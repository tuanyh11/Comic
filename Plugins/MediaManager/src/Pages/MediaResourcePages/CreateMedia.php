<?php

namespace Plugins\MediaManager\Pages\MediaResourcePages;

use Filament\Resources\Pages\CreateRecord;
use Livewire\WithFileUploads;
use Plugins\MediaManager\Pages\MediaResource;
use Plugins\MediaManager\MediaManager;

class CreateMedia extends CreateRecord
{
    use WithFileUploads;
    
    protected static string $resource = MediaResource::class;
    
    public $upload;
    
    public function mount(): void
    {
        $this->form->fill();
    }
    
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Upload sẽ được xử lý bởi MediaUploadAction, không cần xử lý ở đây
        return $data;
    }
    
    public function create(bool $another = false): void
    {
        $this->validate([
            'upload' => 'required|file|max:' . (config('media-manager.max_file_size') / 1024),
        ]);
        
        $mediaManager = app(MediaManager::class);
        $media = $mediaManager->upload($this->upload);
        
        $this->notify('success', 'File uploaded successfully.');
        
        $this->redirect(static::getResource()::getUrl('index'));
    }
}