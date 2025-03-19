<div
    {{ $attributes->merge($getExtraAttributes())->class(['curator-grid-column absolute inset-0 rounded-t-xl overflow-hidden aspect-video']) }}
>
    @php
        $record = $getRecord();
    @endphp

    <div class="rounded-t-xl h-full overflow-hidden bg-gray-100 dark:bg-gray-950/50">
        @if (str($record->type)->contains('image'))
            <img
                src="{{ $record->getSignedUrl(['w' => 640, 'h' => 320, 'fit' => 'crop', 'fm' => 'webp']) }}"
                alt="{{ $record->alt }}"
                @class([
                    'h-full',
                    'w-auto mx-auto' => str($record->type)->contains('svg'),
                    'object-cover w-full' => ! str($record->type)->contains('svg'),
                ])
            />
        @else
            <x-curator::document-image
                :label="$record->name"
                icon-size="lg"
                :type="$record->type"
                :extension="$record->ext"
            />
        @endif

        <style>
             @layer media {
                .table-des {
                bottom: 0;
                left: 0;
                width: 100%;
                line-clamp: 2;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                padding: 0.1rem 0.4rem;
                backdrop-filter: blur(5px);
                font-size: 0.8rem;
            }
             }
        </style>
        <div
            class="absolute table-des  backdrop-blur inset-x-0 bottom-0 flex items-center justify-between px-1.5 pt-10 pb-1.5 text-xs text-white bg-black/10 gap-3"
        >
            <p class="truncate">{{ $record->pretty_name }}</p>
            <p class="flex-shrink-0">{{ $record->size_for_humans }}</p>
        </div>
    </div>
</div>
