<!-- Upload Modal -->
<x-filament::modal
    id="upload-modal"
    :heading="__('Upload Media')"
    :description="__('Upload one or more files to the media library.')"
    :open="$isUploadModalOpen"
    width="md"
>
    <div
        x-data="{ 
            isUploading: false, 
            progress: 0,
            isDragging: false
        }"
        x-on:livewire-upload-start="isUploading = true"
        x-on:livewire-upload-finish="isUploading = false; progress = 0"
        x-on:livewire-upload-error="isUploading = false"
        x-on:livewire-upload-progress="progress = $event.detail.progress"
        class="mb-4"
    >
        <div 
            class="border-2 border-dashed rounded-lg p-6 text-center"
            :class="{'border-primary-400 bg-primary-50': isDragging, 'border-gray-300': !isDragging}"
            x-on:dragover.prevent="isDragging = true"
            x-on:dragleave.prevent="isDragging = false"
            x-on:drop.prevent="isDragging = false"
        >
            <label for="file-upload" class="cursor-pointer block">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="mt-2 block text-sm font-medium text-gray-900">
                    {{ __('Drop files here or click to upload') }}
                </span>
                <span class="mt-1 block text-xs text-gray-500">
                    {{ __('PNG, JPG, GIF, SVG, PDF, MP3, MP4 up to') }} {{ format_bytes(config('media-manager.max_file_size')) }}
                </span>
                <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    class="sr-only" 
                    wire:model="upload"
                />
            </label>
        </div>

        <!-- Progress bar -->
        <div x-show="isUploading" class="mt-2">
            <div class="relative pt-1">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-primary-200">
                    <div
                        :style="`width: ${progress}%`"
                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-300"
                    ></div>
                </div>
                <div class="mt-1 text-xs text-gray-500 text-right" x-text="`${Math.round(progress)}% completed`"></div>
            </div>
        </div>

        @error('upload.*')
            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <x-slot name="footer">
        <div class="flex justify-end space-x-2">
            <x-filament::button
                color="secondary"
                wire:click="closeUploadModal"
            >
                {{ __('Cancel') }}
            </x-filament::button>

            <x-filament::button
                type="submit"
                wire:click="uploadMedia"
                wire:loading.attr="disabled"
            >
                {{ __('Upload') }}
            </x-filament::button>
        </div>
    </x-slot>
</x-filament::modal>

@php
function format_bytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];

    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);

    $bytes /= (1 << (10 * $pow));

    return round($bytes, $precision) . ' ' . $units[$pow];
}
@endphp