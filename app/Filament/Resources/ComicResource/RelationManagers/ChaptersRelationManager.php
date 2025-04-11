<?php

namespace App\Filament\Resources\ComicResource\RelationManagers;

use App\Filament\Resources\ChapterResource;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ChaptersRelationManager extends RelationManager
{
    // Change this to make the label translatable
    protected static ?string $title = null; // Remove the hardcoded value

    // Then add this method to make the title translatable
    public static function getTitle(\Illuminate\Database\Eloquent\Model $ownerRecord, string $pageClass): string
    {
        return __('Chapter');
    }

    protected static string $relationship = 'Chapters';

    // Add this method to make the model label translatable
    public static function getModelLabel(): string
    {
        return __('chapter');
    }

    // Add this method to make the plural model label translatable
    public static function getPluralModelLabel(): string
    {
        return __('chapters');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                ChapterResource::formSchema()
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label(__('Create') . ' ' . __('new') . ' ' . __('chapter')),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label(__('Edit')),
                Tables\Actions\DeleteAction::make()
                    ->label(__('Delete')),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->label(__('Delete selected')),
                ]),
            ]);
    }
}
