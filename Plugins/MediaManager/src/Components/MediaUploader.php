<?php

namespace Plugins\MediaManager\Components;

use Livewire\Component;
use Livewire\WithFileUploads;
use Plugins\MediaManager\MediaManager;

class MediaUploader extends Component
{
    use WithFileUploads;
    
    public $model;
    public $files = [];
    public $uploadProgress = 0;
    public $isUploading = false;
    
    public function mount($model = null)
    {
        $this->model = $model;
    }
    
    public function updatedFiles()
    {
        $this->validate([
            'files.*' => 'file|max:' . (config('media-manager.max_file_size') / 1024),
        ]);
        
        $this->upload();
    }
    
    public function upload()
    {
        $this->isUploading = true;
        $this->uploadProgress = 0;
        
        $mediaManager = app(MediaManager::class);
        $totalFiles = count($this->files);
        $filesProcessed = 0;
        
        foreach ($this->files as $file) {
            $mediaManager->upload($file, $this->model);
            $filesProcessed++;
            $this->uploadProgress = ($filesProcessed / $totalFiles) * 100;
        }
        
        $this->files = [];
        $this->isUploading = false;
        $this->uploadProgress = 100;
        
        $this->emitTo('media-picker', 'refreshMedia');
        $this->emit('mediaUploaded');
        
        // Reset progress after a short delay
        $this->dispatchBrowserEvent('media-upload-complete');
    }
    
    public function render()
    {
        return view('media-manager::livewire.media-uploader');
    }
}