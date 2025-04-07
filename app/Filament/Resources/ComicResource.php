<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ComicResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Chapter;
use App\Models\Comic;
use App\Models\Genre;
use App\Models\Status;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use BezhanSalleh\FilamentShield\Traits\HasPageShield;
use Filament\Forms;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Group as ComponentsGroup;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Group;
use Filament\Wizard;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ComicResource extends Resource
{
    use HasTranslate;

    protected static string $labelName = 'Comic';
    protected static ?string $model = Comic::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationGroup = 'Content Management';

    protected static ?int $navigationSort = 1;

    protected static function getLabelName(): string
    {
        return 'Comics'; 
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
        return ComponentsGroup::make([
            ComponentsGroup::make()
                ->schema([
                    Section::make(__('Information'))
                        ->schema([
                            TextInput::make('title')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->translateLabel()
                                ->afterStateUpdated(fn(Forms\Get $get, Forms\Set $set, ?string $state) =>
                                $set('slug', Str::slug($state))),

                            TextInput::make('slug')
                                ->required()
                                ->maxLength(255)
                                ->unique(Comic::class, 'slug', ignoreRecord: true),

                            CuratorPicker::make('document_ids')
                                ->multiple()
                                ->label('Thumbnail')
                                ->required()
                                ->translateLabel()
                                ->relationship('media', 'id')
                                ->orderColumn('order') // Optional: Rename the order column if needed
                                ->typeColumn('type') // Optional: Rename the type column if needed
                                ->typeValue(Comic::class),


                            Select::make('author_id')
                                ->relationship('author', 'name')
                                ->searchable()
                                ->preload()
                                ->translateLabel()
                                ->createOptionForm([
                                    AuthorResource::formSchema()
                                ])
                                ->required(),

                            Textarea::make('description')
                                ->maxLength(65535)
                                ->translateLabel()
                                ->columnSpanFull(),
                        ]),
                ])
                ->columnSpan(['lg' => 2]),

            ComponentsGroup::make()
                ->schema([
                    Section::make(__('Categories'))
                        ->schema([
                            Select::make('genres')
                                ->translateLabel()
                                ->relationship('genres', 'name')
                                ->multiple()
                                ->preload()
                                ->createOptionForm(GenreResource::formSchema())
                                ->required()
                                ->searchable(),
                            Select::make('tags')
                                ->relationship('tags', 'name')
                                ->multiple()
                                ->translateLabel()
                                ->preload()
                                ->searchable()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->maxLength(255),
                                ]),
                                    Select::make('status_id')
                                    ->relationship('status', 'name')
                                    ->preload()
                                    ->searchable()
                                    ->translateLabel()
                                    ->createOptionForm([
                                        TextInput::make('name')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn(Forms\Get $get, Forms\Set $set, ?string $state) =>
                                            $set('slug', Str::slug($state))),
                                        TextInput::make('slug')
                                            ->required()
                                            ->maxLength(255)
                                            ->unique(Status::class, 'slug'),
                                        ColorPicker::make('color')
                                            ->required(),
                                        Textarea::make('description')
                                            ->maxLength(65535)
                                    ])
                                    ->required()
                        ]),

                    Section::make(__('Statistics'))
                        ->schema([
                            Placeholder::make('chapters_count')
                                ->label('Total Chapters')
                                ->translateLabel()
                                ->content(fn(?Comic $record): int => $record?->chapters()->count() ?? 0),

                            Placeholder::make('total_reads')
                                ->label('Total Reads')
                                ->translateLabel()
                                ->content(fn(?Comic $record): int => $record?->chapters()->sum('read_count') ?? 0),

                            Placeholder::make('total_votes')
                                ->label('Total Votes')
                                ->translateLabel()
                                ->content(fn(?Comic $record): int => $record?->chapters()->sum('vote_count') ?? 0),
                        ])
                        ->visible(fn (?Comic $record) => $record !== null) ,
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
                    ->translateLabel()
                    ->circular()
                    ->defaultImageUrl(fn() => asset('images/placeholder.jpg')),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('author.name')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status.name')
                    ->badge()
                    ->translateLabel()
                   ,

                Tables\Columns\TextColumn::make('chapters_count')
                    ->counts('chapters')
                    ->label('Chapters')
                    ->translateLabel()
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
