<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AuthorResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Lang\Translate;
use App\Models\Author;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;

class AuthorResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Author::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Content Management';

    protected static ?int $navigationSort = 2;

    protected static function getLabelName(): string
    {
        return __('Authors');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                self::formSchema()
            ]);
    }


    public static function formSchema()
    {
        return Section::make('Author Information')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                TextInput::make('stage_name')
                    ->label('Stage Name')
                    ->required()
                    ->translateLabel('Stage Name')
                    ->maxLength(255),
                Textarea::make('description')
                    ->label('Description')
                    ->translateLabel('Description')
                    ->maxLength(65535)
                    ->required()
                    ->columnSpanFull(),
                CuratorPicker::make('document_ids')
                    ->multiple()
                    ->label('Profile Picture')
                    ->translateLabel('Profile Picture')
                    ->acceptedFileTypes(['image/*'])
                    ->relationship('media', 'id')
                    ->orderColumn('order') // Optional: Rename the order column if needed
                    ->typeColumn('type') // Optional: Rename the type column if needed
                    ->typeValue('author'),


            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->translateLabel('Name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('stage_name')
                    ->label('Stage Name')
                    ->translateLabel('Stage Name')
                    ->searchable(),

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
                Tables\Filters\Filter::make('has_comics')
                    ->query(fn(Builder $query): Builder => $query->has('comics'))
                    ->label('Has Comics'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
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
            AuthorResource\RelationManagers\ComicsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAuthors::route('/'),
            'create' => Pages\CreateAuthor::route('/create'),
            'view' => Pages\ViewAuthor::route('/{record}'),
            'edit' => Pages\EditAuthor::route('/{record}/edit'),
        ];
    }
}
