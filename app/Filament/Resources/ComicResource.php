<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ComicResource\Pages;
use App\Models\Comic;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class ComicResource extends Resource
{
    protected static ?string $model = Comic::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationGroup = 'Content Management';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\Grid::make()
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                        if ($operation === 'create') {
                                            $set('slug', Str::slug($state));
                                        }
                                    }),

                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Comic::class, 'slug', ignoreRecord: true),
                            ]),

                        Forms\Components\Select::make('author_id')
                            ->relationship('author', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'reviewing' => 'Reviewing',
                                'published' => 'Published',
                                'completed' => 'Completed',
                            ])
                            ->default('draft')
                            ->required(),

                        Forms\Components\RichEditor::make('description')
                            ->columnSpan('full')
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('comics/descriptions'),

                        CuratorPicker::make('media')
                            ->label('Cover Image')
                            ->relationship('media', 'media')
                            ->buttonLabel('Select Cover Image')
                            ->helperText('Recommended image size: 800x1200 pixels (portrait orientation)')
                            ->columnSpan('full'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('media.url')
                    ->label('Cover')
                    ->square()
                    ->defaultImageUrl(function (Comic $record) {
                        return $record->media?->url ?? asset('images/no-image.jpg');
                    }),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('author.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'danger' => 'draft',
                        'warning' => 'reviewing',
                        'success' => 'published',
                        'primary' => 'completed',
                    ]),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'reviewing' => 'Reviewing',
                        'published' => 'Published',
                        'completed' => 'Completed',
                    ]),
                Tables\Filters\SelectFilter::make('author')
                    ->relationship('author', 'name'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListComics::route('/'),
            'create' => Pages\CreateComic::route('/create'),
            'edit' => Pages\EditComic::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['author', 'media']);
    }
}