<?php

namespace Plugins\MediaManager\Components;

use App\Models\Media;
use Filament\Forms\Components\Field;
use Illuminate\Database\Eloquent\Model;
use Livewire\Component;
use Plugins\MediaManager\MediaManager;

class MediaPicker extends Component
{
    public $model;
    public $mediaIds = [];
    public $multiple = false;
    public $preview = true;
    public $label = 'Media';
    public $placeholder = 'Select media';
    
    public $allMedia = [];
    public $selectedMedia = [];
    public $isOpen = false;
    
    public function mount($model = null, $mediaIds = [], $multiple = false, $preview = true, $label = 'Media', $placeholder = 'Select media')
    {
        $this->model = $model;
        $this->mediaIds = $mediaIds;
        $this->multiple = $multiple;
        $this->preview = $preview;
        $this->label = $label;
        $this->placeholder = $placeholder;
        
        $this->loadMedia();
        $this->loadSelectedMedia();
    }
    
    public function loadMedia()
    {
        $this->allMedia = Media::latest()->get();
    }
    
    public function loadSelectedMedia()
    {
        if (empty($this->mediaIds)) {
            $this->selectedMedia = [];
            return;
        }
        
        $this->selectedMedia = Media::whereIn('id', $this->mediaIds)->get();
    }
    
    public function openModal()
    {
        $this->loadMedia();
        $this->isOpen = true;
    }
    
    public function closeModal()
    {
        $this->isOpen = false;
    }
    
    public function selectMedia($mediaId)
    {
        if (!$this->multiple) {
            $this->mediaIds = [$mediaId];
        } else {
            if (in_array($mediaId, $this->mediaIds)) {
                $this->mediaIds = array_diff($this->mediaIds, [$mediaId]);
            } else {
                $this->mediaIds[] = $mediaId;
            }
        }
        
        $this->loadSelectedMedia();
        
        if (!$this->multiple) {
            $this->closeModal();
        }
        
        $this->emitUp('mediaSelected', $this->mediaIds);
    }
    
    public function removeMedia($mediaId)
    {
        $this->mediaIds = array_diff($this->mediaIds, [$mediaId]);
        $this->loadSelectedMedia();
        $this->emitUp('mediaSelected', $this->mediaIds);
    }
    
    public function getMediaUrl($media)
    {
        $mediaManager = app(MediaManager::class);
        
        if (str_starts_with($media->mime_type, 'image/')) {
            return $mediaManager->getThumbnailUrl($media) ?? $mediaManager->getUrl($media);
        }
        
        // Return appropriate icon based on mime type
        return match(true) {
            str_starts_with($media->mime_type, 'video/') => asset('vendor/media-manager/icons/video.svg'),
            str_starts_with($media->mime_type, 'audio/') => asset('vendor/media-manager/icons/audio.svg'),
            str_starts_with($media->mime_type, 'application/pdf') => asset('vendor/media-manager/icons/pdf.svg'),
            default => asset('vendor/media-manager/icons/file.svg'),
        };
    }
    
    public function render()
    {
        return view('media-manager::livewire.media-picker');
    }
}