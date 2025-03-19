<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ChapterResource\Pages;
use App\Models\Chapter;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ChapterResource extends Resource
{
    protected static ?string $model = Chapter::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Content Management';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([self::formSchema()])
            ->columns(3);
    }

    public static function formSchema()
    {
        return Forms\Components\Group::make()->schema([
            Forms\Components\Group::make()
                ->schema([
                    Forms\Components\Section::make('Chapter Information')
                        ->schema([
                            Forms\Components\Select::make('comic_id')
                                ->relationship('comic', 'title')
                                ->required()
                                ->searchable()
                                ->preload(),

                            Forms\Components\TextInput::make('title')
                                ->required()
                                ->maxLength(255),

                            Forms\Components\TextInput::make('order')
                                ->integer()
                                ->default(fn(Forms\Get $get) =>
                                Chapter::where('comic_id', $get('comic_id'))->max('order') + 1)
                                ->required(),

                            Forms\Components\Textarea::make('description')
                                ->maxLength(65535)
                                ->columnSpanFull(),

                            CuratorPicker::make('document_ids')
                                ->multiple()
                                ->label('Content')
                                ->relationship('media', 'id')
                                ->orderColumn('order') // Optional: Rename the order column if needed
                                ->typeColumn('type') // Optional: Rename the type column if needed
                                ->typeValue(Chapter::class),
                        ]),
                ])
                ->columnSpan(['lg' => 2]),

            Forms\Components\Group::make()
                ->schema([
                    Forms\Components\Section::make('Access Settings')
                        ->schema([
                            Forms\Components\TextInput::make('pricing')
                                ->numeric()
                                ->default(0)
                                ->suffix('VND')
                                ->helperText('0 for free access')
                                ->required(),
                        ]),

                    Forms\Components\Section::make('Statistics')
                        ->schema([
                            Forms\Components\Placeholder::make('read_count')
                                ->label('Read Count')
                                ->content(fn(?Chapter $record): int => $record?->read_count ?? 0),

                            Forms\Components\Placeholder::make('vote_count')
                                ->label('Vote Count')
                                ->content(fn(?Chapter $record): int => $record?->vote_count ?? 0),

                            Forms\Components\Placeholder::make('purchases_count')
                                ->label('Purchases')
                                ->content(fn(?Chapter $record): int => $record?->purchasedBy()->count() ?? 0),

                            Forms\Components\Placeholder::make('revenue')
                                ->label('Revenue')
                                ->content(fn(?Chapter $record): string =>
                                number_format($record?->payments()->sum('amount') ?? 0) . ' VND'),
                        ]),
                ])
                ->columnSpan(['lg' => 1])
        ])
        ->columnSpanFull();
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('comic.title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('order')
                    ->sortable(),

                Tables\Columns\TextColumn::make('pricing')
                    ->money('VND')
                    ->label('Price')
                    ->sortable(),

                Tables\Columns\TextColumn::make('read_count')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('vote_count')
                    ->sortable()
                    ->toggleable(),

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
                Tables\Filters\SelectFilter::make('comic')
                    ->relationship('comic', 'title')
                    ->searchable()
                    ->preload(),

                Tables\Filters\Filter::make('paid_content')
                    ->label('Paid Content Only')
                    ->query(fn(Builder $query): Builder => $query->where('pricing', '>', 0)),

                Tables\Filters\Filter::make('free_content')
                    ->label('Free Content Only')
                    ->query(fn(Builder $query): Builder => $query->where('pricing', 0)),
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
            ->defaultSort('comic_id');
        // ->groupedByClosure(fn ($record) => $record->comic->title);
    }

    public static function getRelations(): array
    {
        return [
            ChapterResource\RelationManagers\CommentsRelationManager::class,
            ChapterResource\RelationManagers\PaymentsRelationManager::class,
            ChapterResource\RelationManagers\PurchasedByRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListChapters::route('/'),
            'create' => Pages\CreateChapter::route('/create'),
            'edit' => Pages\EditChapter::route('/{record}/edit'),
        ];
    }
}
