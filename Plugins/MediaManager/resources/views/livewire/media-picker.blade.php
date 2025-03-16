<div>
    <div class="space-y-2">
        <div class="flex justify-between items-center">
            <label class="inline-block text-sm font-medium text-gray-700">{{ $label }}</label>
            <button type="button" wire:click="openModal"
                class="px-4 py-2 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Select Media
            </button>
        </div>

        @if ($preview && count($selectedMedia) > 0)
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
                @foreach ($selectedMedia as $media)
                    <div class="relative group">
                        <div
                            class="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center">
                            @if (str_starts_with($media->mime_type, 'image/'))
                                <img src="{{ $this->getMediaUrl($media) }}" alt="{{ $media->name }}"
                                    class="object-cover w-full h-full" />
                            @else
                                <div class="flex flex-col items-center justify-center p-2 text-center">
                                    <img src="{{ $this->getMediaUrl($media) }}" alt="{{ $media->mime_type }}"
                                        class="w-10 h-10 mb-2" />
                                    <span class="text-xs truncate max-w-full">{{ $media->name }}</span>
                                </div>
                            @endif
                        </div>
                        <button type="button" wire:click="removeMedia({{ $media->id }})"
                            class="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                                </path>
                            </svg>
                        </button>
                    </div>
                @endforeach
            </div>
        @endif

        @if (count($selectedMedia) === 0)
            <div class="text-sm text-gray-500">{{ $placeholder }}</div>
        @endif
    </div>

    <!-- Media Browser Modal -->
    <div x-data="{ open: @entangle('isOpen') }" x-show="open" x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0" class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div x-show="open" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200"
                x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
                class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div x-show="open" x-transition:enter="ease-out duration-300"
                x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                x-transition:leave="ease-in duration-200"
                x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
                <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button type="button" wire:click="closeModal"
                        class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <span class="sr-only">Close</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                            Select Media
                        </h3>

                        <div class="mt-4">
                            <!-- File uploader component -->
                            @livewire('media-uploader', ['model' => $model], key('media-uploader-' . now()))

                            <div class="mt-4">
                                @if (count($allMedia) > 0)
                                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        @foreach ($allMedia as $media)
                                            <div wire:click="selectMedia({{ $media->id }})"
                                                class="cursor-pointer overflow-hidden rounded-lg border {{ in_array($media->id, $mediaIds) ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200 hover:border-primary-500' }} bg-gray-50 aspect-square flex items-center justify-center">
                                                @if (str_starts_with($media->mime_type, 'image/'))
                                                    <img src="{{ $this->getMediaUrl($media) }}" alt="{{ $media->name }}"
                                                        class="object-cover w-full h-full" />
                                                @else
                                                    <div class="flex flex-col items-center justify-center p-2 text-center">
                                                        <img src="{{ $this->getMediaUrl($media) }}" alt="{{ $media->mime_type }}"
                                                            class="w-10 h-10 mb-2" />
                                                        <span class="text-xs truncate max-w-full">{{ $media->name }}</span>
                                                    </div>
                                                @endif
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <div class="text-center py-8">
                                        <p class="text-gray-500 text-sm">No media files found. Upload some files to get
                                            started.</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button type="button" wire:click="closeModal"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Done
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>