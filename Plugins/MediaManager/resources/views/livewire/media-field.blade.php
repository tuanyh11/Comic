<x-dynamic-component :component="$getFieldWrapperView()" :id="$getId()" :label="$getLabel()"
    :label-sr-only="$isLabelHidden()" :helper-text="$getHelperText()" :hint="$getHint()" :hint-icon="$getHintIcon()"
    :required="$isRequired()" :state-path="$getStatePath()">
    <div x-data="{
            state: $wire.entangle('{{ $getStatePath() }}'),
        }" class="space-y-2">
        @php
            $isMultiple = $isMultiple();
            $showPreview = $shouldShowPreview();
        @endphp

        @livewire('media-picker', [
            'mediaIds' => $isMultiple ? $getState() : [$getState()],
            'multiple' => $isMultiple,
            'preview' => $showPreview,
            'label' => $getLabel(),
            'placeholder' => $getPlaceholder(),
        ], key($getId()))
    </div>
</x-dynamic-component>