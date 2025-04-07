<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TagResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Tag;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TagResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Tag::class;

    protected static ?string $navigationIcon = 'heroicon-o-hashtag';

    protected static ?string $navigationGroup = 'Taxonomy';

    protected static ?int $navigationSort = 2;

    protected static function getLabelName(): string
    {
        return __('Tags');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema(self::formSchema());
    }

    public static function formSchema()
    {
        return [
            Section::make(__('Information'))
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->translateLabel()
                        ->maxLength(255)
                ])
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('comics_count')
                    ->counts('comics')
                    ->label('Comics')
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->translateLabel()
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTags::route('/'),
            'create' => Pages\CreateTag::route('/create'),
            'edit' => Pages\EditTag::route('/{record}/edit'),
        ];
    }
}
