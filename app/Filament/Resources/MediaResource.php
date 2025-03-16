<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MediaResource\Pages;
use App\Models\Media;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaResource extends Resource
{
    protected static ?string $model = Media::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationGroup = 'Media Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Media Information')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                                
                                Forms\Components\TextInput::make('collection')
                                    ->maxLength(255)
                                    ->helperText('Optional collection name to group media files'),
                                
                                Forms\Components\Select::make('mediable_type')
                                    ->label('Related Model')
                                    ->options(function () {
                                        // Get all models that use HasFilamentMedia trait
                                        // You may need to customize this based on your application structure
                                        $models = [];
                                        foreach (glob(app_path('Models') . '/*.php') as $file) {
                                            $className = 'App\\Models\\' . pathinfo($file, PATHINFO_FILENAME);
                                            if (class_exists($className)) {
                                                $traits = class_uses_recursive($className);
                                                if (in_array('App\\Traits\\HasFilamentMedia', $traits)) {
                                                    $models[$className] = Str::of(class_basename($className))->headline();
                                                }
                                            }
                                        }
                                        return $models;
                                    })
                                    ->searchable()
                                    ->disabled(fn($record) => $record && $record->mediable_type),
                                
                                Forms\Components\TextInput::make('mediable_id')
                                    ->label('Related ID')
                                    ->disabled(fn($record) => $record && $record->mediable_id)
                                    ->numeric()
                                    ->visible(fn($get) => $get('mediable_type')),
                            ]),
                    ])
                    ->columnSpan(['lg' => 2]),
                
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Media Preview')
                            ->schema([
                                Forms\Components\Placeholder::make('preview')
                                    ->content(function ($record) {
                                        if (!$record) return 'No media selected';
                                        
                                        $url = Storage::disk($record->disk)->url($record->path);
                                        
                                        if (Str::startsWith($record->mime_type, 'image/')) {
                                            return new \Filament\Infolists\Components\ImageEntry(
                                                $url
                                            );
                                        }
                                        
                                        return new \Filament\Infolists\Components\TextEntry(
                                            'File: ' . $record->file_name
                                        );
                                    }),
                                
                                Forms\Components\Placeholder::make('mime_type')
                                    ->label('File Type')
                                    ->content(fn ($record) => $record?->mime_type ?? '-'),
                                    
                                Forms\Components\Placeholder::make('size')
                                    ->label('File Size')
                                    ->content(function ($record) {
                                        if (!$record) return '-';
                                        
                                        $size = $record->size;
                                        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
                                        
                                        $i = 0;
                                        while ($size >= 1024 && $i < count($units) - 1) {
                                            $size /= 1024;
                                            $i++;
                                        }
                                        
                                        return round($size, 2) . ' ' . $units[$i];
                                    }),
                                    
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Uploaded At')
                                    ->content(fn ($record) => $record?->created_at ? $record->created_at->diffForHumans() : '-'),
                                    
                            ])
                            ->visible(fn($record) => $record !== null),
                            
                        Forms\Components\Section::make('File Upload')
                            ->schema([
                                Forms\Components\FileUpload::make('file_upload')
                                    ->label('Upload New File')
                                    ->disk('public')
                                    ->directory('media')
                                    ->visibility('public')
                                    ->required()
                                    ->visible(function ($record) {
                                        // Only show for creating new records
                                        return $record === null;
                                    })
                                    ->afterStateUpdated(function (callable $set, $state) {
                                        if (!$state) return;
                                        
                                        $file = pathinfo($state, PATHINFO_FILENAME);
                                        $set('name', $file);
                                    }),
                            ])
                            ->visible(fn($record) => $record === null),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('path')
                    ->label('Preview')
                    ->disk('public')
                    ->visibility('public')
                    ->circular(false)
                    ->square()
                    ->defaultImageUrl(function (Media $record) {
                        if (!Str::startsWith($record->mime_type, 'image/')) {
                            // Show an icon for non-image files
                            return asset('images/file-icon.png');
                        }
                        return null;
                    }),
                
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('file_name')
                    ->searchable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('collection')
                    ->searchable()
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('mime_type')
                    ->label('Type')
                    ->searchable()
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('size')
                    ->label('Size')
                    ->formatStateUsing(function ($state) {
                        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
                        $size = $state;
                        
                        $i = 0;
                        while ($size >= 1024 && $i < count($units) - 1) {
                            $size /= 1024;
                            $i++;
                        }
                        
                        return round($size, 2) . ' ' . $units[$i];
                    }),
                
                Tables\Columns\TextColumn::make('mediable_type')
                    ->label('Related Model')
                    ->formatStateUsing(function ($state) {
                        if (!$state) return '-';
                        return Str::of(class_basename($state))->headline();
                    })
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Uploaded')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('collection')
                    ->options(function () {
                        return Media::distinct('collection')
                            ->whereNotNull('collection')
                            ->pluck('collection', 'collection')
                            ->toArray();
                    }),
                
                Tables\Filters\SelectFilter::make('mime_type')
                    ->label('File Type')
                    ->options(function () {
                        $types = Media::distinct('mime_type')
                            ->pluck('mime_type', 'mime_type')
                            ->toArray();
                            
                        $groupedTypes = [];
                        
                        foreach ($types as $type => $value) {
                            $mainType = explode('/', $type)[0];
                            $groupedTypes[ucfirst($mainType)][$type] = $value;
                        }
                        
                        return $groupedTypes;
                    }),
                
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->modalContent(function (Media $record) {
                        $url = Storage::disk($record->disk)->url($record->path);
                        
                        if (Str::startsWith($record->mime_type, 'image/')) {
                            return view('filament.resources.media-resource.image-preview', [
                                'url' => $url,
                                'record' => $record,
                            ]);
                        }
                        
                        return view('filament.resources.media-resource.file-details', [
                            'record' => $record,
                            'url' => $url,
                        ]);
                    }),
                
                Tables\Actions\Action::make('download')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->url(function (Media $record) {
                        return Storage::disk($record->disk)->url($record->path);
                    })
                    ->openUrlInNewTab(),
                
                Tables\Actions\EditAction::make(),
                
                Tables\Actions\DeleteAction::make()
                    ->before(function (Media $record) {
                        // Delete file from disk before deleting record
                        Storage::disk($record->disk)->delete($record->path);
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->before(function ($records) {
                            // Delete files from disk before deleting records
                            $records->each(function (Media $record) {
                                Storage::disk($record->disk)->delete($record->path);
                            });
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMedia::route('/'),
            'create' => Pages\CreateMedia::route('/create'),
            'edit' => Pages\EditMedia::route('/{record}/edit'),
        ];
    }
}