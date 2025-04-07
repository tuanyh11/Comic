<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GenreResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Genre;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Forms;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class GenreResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Genre::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationGroup = 'Taxonomy';

    protected static ?int $navigationSort = 1;

    protected static function getLabelName(): string
    {
        return __('Genre');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema(self::formSchema());
    }

    public static function formSchema(): array
    {
        return [
            Grid::make(3)->schema([
                Section::make(__('Information'))
                    ->schema([
                        Group::make()
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->translateLabel('Name')
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn(Forms\Get $get, Forms\Set $set, ?string $state) =>
                                    $set('slug', Str::slug($state))),

                                TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Genre::class, 'slug', ignoreRecord: true),
                            ])->columns(1),
                    ])->columns(1)->columnSpan(2),
                Section::make(__('Media'))
                    ->schema([
                        CuratorPicker::make('document_ids')
                            ->multiple()
                            ->acceptedFileTypes(['image/*'])
                            ->label('Thumbnail')
                            ->translateLabel('Thumbnail')
                            ->relationship('media', 'id')
                            ->orderColumn('order') // Optional: Rename the order column if needed
                            ->typeColumn('type') // Optional: Rename the type column if needed
                            ->typeValue(Genre::class),
                    ])->columns(1)->columnSpan(1)
            ])
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->translateLabel('Name')
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('comics_count')
                    ->counts('comics')
                    ->label('Comics')
                    ->translateLabel('Comics')
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
                //
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListGenres::route('/'),
            'create' => Pages\CreateGenre::route('/create'),
            'edit' => Pages\EditGenre::route('/{record}/edit'),
        ];
    }
}
