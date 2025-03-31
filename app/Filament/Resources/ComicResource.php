<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ComicResource\Pages;
use App\Models\Chapter;
use App\Models\Comic;
use App\Models\Status;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use BezhanSalleh\FilamentShield\Traits\HasPageShield;
use Filament\Forms;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ComicResource extends Resource
{
    // use HasPageShield;

    protected static ?string $model = Comic::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationGroup = 'Content Management';

    protected static ?int $navigationSort = 1;

    public static function getNavigationLabel(): string
    {
        return app()->getLocale() === 'vi' ? 'Truyện Tranh' : 'Comics';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                 self::formSchema(),
            ])->columns(3);
    }

    public static function formSchema()
    {
        return Group::make([
            Forms\Components\Group::make()
                ->schema([
                    Forms\Components\Section::make('Comic Information')
                        ->schema([
                            Forms\Components\TextInput::make('title')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn(Forms\Get $get, Forms\Set $set, ?string $state) =>
                                $set('slug', Str::slug($state))),

                            Forms\Components\TextInput::make('slug')
                                ->required()
                                ->maxLength(255)
                                ->unique(Comic::class, 'slug', ignoreRecord: true),

                            CuratorPicker::make('document_ids')
                                ->multiple()
                                ->label('Thumbnail Image')
                                ->required()
                                ->relationship('media', 'id')
                                ->orderColumn('order') // Optional: Rename the order column if needed
                                ->typeColumn('type') // Optional: Rename the type column if needed
                                ->typeValue(Comic::class),


                            Forms\Components\Select::make('author_id')
                                ->relationship('author', 'name')
                                ->searchable()
                                ->preload()
                                ->createOptionForm([
                                    AuthorResource::formSchema()
                                ])
                                ->required(),

                            Forms\Components\Textarea::make('description')
                                ->maxLength(65535)
                                ->columnSpanFull(),
                        ]),
                ])
                ->columnSpan(['lg' => 2]),

            Forms\Components\Group::make()
                ->schema([
                    Forms\Components\Section::make('Categories')
                        ->schema([
                            Forms\Components\Select::make('genres')
                                ->relationship('genres', 'name')
                                ->multiple()
                                ->preload()
                                ->createOptionForm([
                                    Forms\Components\TextInput::make('name')
                                        ->required()
                                        ->maxLength(255),
                                    Forms\Components\TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255)
                                ])
                                ->searchable(),

                            Forms\Components\Select::make('tags')
                                ->relationship('tags', 'name')
                                ->multiple()
                                ->preload()
                                ->searchable()
                                ->createOptionForm([
                                    Forms\Components\TextInput::make('name')
                                        ->required()
                                        ->maxLength(255),
                                ]),
                                    Forms\Components\Select::make('status_id')
                                    ->relationship('status', 'name')
                                    ->preload()
                                    ->searchable()
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn(Forms\Get $get, Forms\Set $set, ?string $state) =>
                                            $set('slug', Str::slug($state))),
                                        Forms\Components\TextInput::make('slug')
                                            ->required()
                                            ->maxLength(255)
                                            ->unique(Status::class, 'slug'),
                                        Forms\Components\ColorPicker::make('color')
                                            ->required(),
                                        Forms\Components\Textarea::make('description')
                                            ->maxLength(65535)
                                    ])
                                    ->required()
                        ]),

                    Forms\Components\Section::make('Stats')
                        ->schema([
                            Forms\Components\Placeholder::make('chapters_count')
                                ->label('Total Chapters')
                                ->content(fn(?Comic $record): int => $record?->chapters()->count() ?? 0),

                            Forms\Components\Placeholder::make('total_reads')
                                ->label('Total Reads')
                                ->content(fn(?Comic $record): int => $record?->chapters()->sum('read_count') ?? 0),

                            Forms\Components\Placeholder::make('total_votes')
                                ->label('Total Votes')
                                ->content(fn(?Comic $record): int => $record?->chapters()->sum('vote_count') ?? 0),
                        ]),
                ])
                ->columnSpan(['lg' => 1]),
        ])->columnSpanFull()->columns(3);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('media.media.url')
                    ->label('Thumbnail')
                    ->circular()
                    ->defaultImageUrl(fn() => asset('images/placeholder.jpg')),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('author.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status.name')
                    ->badge()
                   ,

                Tables\Columns\TextColumn::make('chapters_count')
                    ->counts('chapters')
                    ->label('Chapters')
                    ->sortable(),

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
                        'ongoing' => 'Ongoing',
                        'completed' => 'Completed',
                        'hiatus' => 'Hiatus',
                        'cancelled' => 'Cancelled',
                    ]),

                Tables\Filters\SelectFilter::make('author')
                    ->relationship('author', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('genres')
                    ->relationship('genres', 'name')
                    ->searchable()
                    ->preload()
                    ->multiple(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            ComicResource\RelationManagers\ChaptersRelationManager::class,
            ComicResource\RelationManagers\GenresRelationManager::class,
            ComicResource\RelationManagers\TagsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListComics::route('/'),
            'create' => Pages\CreateComic::route('/create'),
            // 'view' => Pages\ViewComic::route('/{record}'),
            'edit' => Pages\EditComic::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withChapterStats()
            ->with(['media.media']);
    }
}
