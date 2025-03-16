<?php

namespace Plugins\MediaManager\Pages;

use App\Models\Media;
use Filament\Forms;
use Filament\Forms\Form as FormsForm;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\ActionGroup;
use Plugins\MediaManager\MediaManager;
use Plugins\MediaManager\Pages\MediaResourcePages;

class MediaResource extends Resource
{
    protected static ?string $model = Media::class;

    protected static ?string $navigationIcon = 'heroicon-o-photograph';

    protected static ?string $navigationGroup = 'Content';

    protected static ?string $navigationLabel = 'Media Library';

    protected static ?string $slug = 'media-library';

    public static function form(FormsForm $form): FormsForm
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('file_name')
                            ->required()
                            ->maxLength(255)
                            ->disabled(),
                        Forms\Components\TextInput::make('mime_type')
                            ->required()
                            ->maxLength(255)
                            ->disabled(),
                        Forms\Components\TextInput::make('size')
                            ->required()
                            ->numeric()
                            ->disabled()
                            ->formatStateUsing(fn($state) => format_bytes($state)),
                    ]),
            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                ImageColumn::make('preview')
                    ->label('Preview')
                    ->getStateUsing(function (Media $record) {
                        $mediaManager = app(MediaManager::class);

                        if (str_starts_with($record->mime_type, 'image/')) {
                            return $mediaManager->getThumbnailUrl($record) ?? $mediaManager->getUrl($record);
                        }

                        return null;
                    })
                    ->square()
                    ->visibility(fn($record) => str_starts_with($record->mime_type, 'image/')),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('file_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('mime_type')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('size')
                    ->formatStateUsing(fn($state) => format_bytes($state))
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('mime_type')
                    ->options([
                        'image/jpeg' => 'JPEG Image',
                        'image/png' => 'PNG Image',
                        'image/gif' => 'GIF Image',
                        'image/svg+xml' => 'SVG Image',
                        'application/pdf' => 'PDF Document',
                        'video/mp4' => 'MP4 Video',
                        'audio/mpeg' => 'MP3 Audio',
                    ])
                    ->label('File Type'),
            ])
            ->actions([
                ActionGroup::make([
                    Action::make('view')
                        ->label('View')
                        ->icon('heroicon-o-eye')
                        ->url(fn(Media $record) => app(MediaManager::class)->getUrl($record))
                        ->openUrlInNewTab(),
                    Action::make('download')
                        ->label('Download')
                        ->icon('heroicon-o-download')
                        ->url(fn(Media $record) => app(MediaManager::class)->getUrl($record))
                        ->openUrlInNewTab(),
                    Action::make('delete')
                        ->label('Delete')
                        ->icon('heroicon-o-trash')
                        ->color('danger')
                        ->action(function (Media $record) {
                            app(MediaManager::class)->delete($record);
                        }),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make()
                    ->action(function ($records) {
                        $mediaManager = app(MediaManager::class);

                        foreach ($records as $record) {
                            $mediaManager->delete($record);
                        }
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => MediaResourcePages\ListMedia::route('/'),
            'create' => MediaResourcePages\CreateMedia::route('/create'),
            'edit' => MediaResourcePages\EditMedia::route('/{record}/edit'),
        ];
    }
}

if (!function_exists('format_bytes')) {
    function format_bytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
