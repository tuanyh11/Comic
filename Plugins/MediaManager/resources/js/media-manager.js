document.addEventListener('DOMContentLoaded', function () {
    // Handle file upload drag & drop
    const setupMediaUploader = () => {
        const dropzones = document.querySelectorAll('[data-media-dropzone]');

        dropzones.forEach((dropzone) => {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragging');
            });

            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragging');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragging');

                // Find the file input and update its files
                const fileInput = dropzone.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.files = e.dataTransfer.files;

                    // Trigger change event for Livewire to detect
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
        });
    };

    // Setup media previews
    const setupMediaPreviews = () => {
        const mediaItems = document.querySelectorAll('[data-media-preview]');

        mediaItems.forEach((item) => {
            const mediaType = item.getAttribute('data-media-type');
            const mediaUrl = item.getAttribute('data-media-url');

            if (mediaType && mediaType.startsWith('image/')) {
                // Create image preview
                const img = document.createElement('img');
                img.src = mediaUrl;
                img.alt =
                    item.getAttribute('data-media-name') || 'Media preview';
                img.className = 'max-w-full max-h-full object-contain';

                item.appendChild(img);
            } else {
                // Create file type icon
                const iconContainer = document.createElement('div');
                iconContainer.className =
                    'flex flex-col items-center justify-center';

                const icon = document.createElement('div');
                icon.className = 'media-type-icon mb-2';

                // Select icon based on mime type
                let iconSvg = '';
                if (mediaType) {
                    if (mediaType.startsWith('video/')) {
                        iconSvg =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                    } else if (mediaType.startsWith('audio/')) {
                        iconSvg =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>';
                    } else if (mediaType === 'application/pdf') {
                        iconSvg =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
                    } else {
                        iconSvg =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>';
                    }
                }

                icon.innerHTML = iconSvg;
                iconContainer.appendChild(icon);

                // Add file name
                const name = document.createElement('span');
                name.className = 'text-xs text-center truncate w-full';
                name.textContent =
                    item.getAttribute('data-media-name') || 'Unknown file';
                iconContainer.appendChild(name);

                item.appendChild(iconContainer);
            }
        });
    };

    // Initialize components
    setupMediaUploader();
    setupMediaPreviews();

    // Listen for Livewire events to reinitialize components
    document.addEventListener('livewire:load', function () {
        window.Livewire.hook('message.processed', (message, component) => {
            setupMediaUploader();
            setupMediaPreviews();
        });
    });
});
