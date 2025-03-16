<?php

namespace Plugins\MediaManager\Forms\Components;

use Closure;
use Filament\Forms\Components\Field;
use Illuminate\Database\Eloquent\Model;

class MediaField extends Field
{
    protected string $view = 'media-manager::forms.components.media-field';

    protected bool $multiple = false;
    
    protected bool $showPreview = true;
    
    protected string $mediaRelationship = 'media';
    
    protected ?Closure $saveRelationshipsUsing = null;
    
    public function multiple(bool $condition = true): static
    {
        $this->multiple = $condition;
        
        return $this;
    }
    
    public function showPreview(bool $condition = true): static
    {
        $this->showPreview = $condition;
        
        return $this;
    }
    
    public function mediaRelationship(string $relationship): static
    {
        $this->mediaRelationship = $relationship;
        
        return $this;
    }
    
    public function isMultiple(): bool
    {
        return $this->multiple;
    }
    
    public function shouldShowPreview(): bool
    {
        return $this->showPreview;
    }
    
    public function getMediaRelationship(): string
    {
        return $this->mediaRelationship;
    }
    
    public function saveRelationships(?Model $record = null): void
    {
        if ($this->saveRelationshipsUsing) {
            $callback = $this->saveRelationshipsUsing;
            $callback($record, $this->getState());
            
            return;
        }
        
        if (!$record) {
            return;
        }
        
        $state = $this->getState();
        
        if (!is_array($state)) {
            $state = $state ? [$state] : [];
        }
        
        $record->{$this->getMediaRelationship()}()->sync($state);
    }
    
    public function saveRelationshipsUsing(?Closure $callback): static
    {
        $this->saveRelationshipsUsing = $callback;
        
        return $this;
    }
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->afterStateHydrated(function (MediaField $component, $state) {
            $record = $component->getRecord();
            
            if (!$record) {
                return;
            }
            
            $mediaRelationship = $component->getMediaRelationship();
            
            if ($state === null) {
                if ($component->isMultiple()) {
                    $mediaIds = $record->{$mediaRelationship}()->pluck('id')->toArray();
                    $component->state($mediaIds);
                } else {
                    $media = $record->{$mediaRelationship}()->first();
                    $component->state($media ? $media->id : null);
                }
            }
        });
        
        $this->dehydrated(false);
    }
}