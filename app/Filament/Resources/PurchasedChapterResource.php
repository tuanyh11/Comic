<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PurchasedChapterResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\PurchasedChapter;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PurchasedChapterResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = PurchasedChapter::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    
    protected static ?string $navigationGroup = 'Financial Management';
    
    protected static ?int $navigationSort = 4;
    
    protected static ?string $pluralModelLabel = 'Purchased Chapters';

    protected static function getLabelName(): string
    {
        return __('Purchased Chapter');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                
                Forms\Components\Select::make('chapter_id')
                    ->relationship('chapter', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                
                Forms\Components\TextInput::make('price_paid')
                    ->numeric()
                    ->suffix('VND')
                    ->required(),
                
                Forms\Components\TextInput::make('payment_id')
                    ->maxLength(255)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('chapter.comic.title')
                    ->label('Comic')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('chapter.title')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('price_paid')
                    ->money('VND')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('payment_id')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('user')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\SelectFilter::make('chapter')
                    ->relationship('chapter.comic', 'title')
                    ->label('Comic')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when(
                                $data['created_from'] ?? null,
                                fn ($query, $date) => $query->whereDate('created_at', '>=', $date)
                            )
                            ->when(
                                $data['created_until'] ?? null,
                                fn ($query, $date) => $query->whereDate('created_at', '<=', $date)
                            );
                    }),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPurchasedChapters::route('/'),
            'create' => Pages\CreatePurchasedChapter::route('/create'),
            // 'view' => Pages\ViewPurchasedChapter::route('/{record}'),
            'edit' => Pages\EditPurchasedChapter::route('/{record}/edit'),
        ];
    }
}