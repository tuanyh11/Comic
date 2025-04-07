<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ChapterResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Chapter;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Forms;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ChapterResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Chapter::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Content Management';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'title';


    protected static function getLabelName(): string
    {
        return __('Chapters');
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([self::formSchema()])
            ->columns(3);
    }


    public static function formSchema(bool $isHiddenComic = false)
    {
        return Group::make()->schema([
            Group::make()
                ->schema([
                    Section::make(__('Information'))
                        ->schema([
                            Select::make('comic_id')
                                ->label('Comic')
                                ->translateLabel('Comic')
                                ->relationship('comic', 'title')
                                ->required()
                                ->searchable()
                                ->hidden($isHiddenComic)
                                ->preload(),

                            TextInput::make('title')
                                ->required()
                                ->translateLabel('Title')
                                ->maxLength(255),

                            TextInput::make('order')
                                ->integer()
                                ->translateLabel('Order')
                                ->default(fn(Forms\Get $get) =>
                                Chapter::where('comic_id', $get('comic_id'))->max('order') + 1)
                                ->required(),

                            Textarea::make('description')
                                ->maxLength(65535)
                                ->translateLabel('Description')
                                ->columnSpanFull(),

                            CuratorPicker::make('document_ids')
                                ->multiple()
                                ->required()
                                ->label('Content')
                                ->translateLabel('Content')
                                ->acceptedFileTypes(['application/pdf'])
                                ->relationship('media', 'id')
                                ->orderColumn('order') // Optional: Rename the order column if needed
                                ->typeColumn('type') // Optional: Rename the type column if needed
                                ->typeValue(Chapter::class),
                        ]),
                ])
                ->columnSpan(['lg' => 2]),

            Group::make()
                ->schema([
                    Section::make(__('Access Settings'))
                        ->schema([
                            TextInput::make('pricing')
                                ->numeric()
                                ->label('Price')
                                ->translateLabel('Price')
                                ->default(0)
                                ->suffix('VND')
                                ->minValue(10000)
                                ->required()
                                ->live()
                                ->helperText(
                                    fn(\Filament\Forms\Get $get) =>
                                    number_format((int)$get('pricing'), 0, ',', '.') . ' VND'
                                ),
                        ]),

                    Section::make(__('Statistics'))
                        ->schema([
                            Placeholder::make('read_count')
                                ->label('Read Count')
                                ->translateLabel('Read Count')
                                ->content(fn(?Chapter $record): int => $record?->read_count ?? 0),

                            Placeholder::make('vote_count')
                                ->label('Vote Count')
                                ->translateLabel('Vote Count')
                                ->content(fn(?Chapter $record): int => $record?->vote_count ?? 0),

                            Placeholder::make('purchases_count')
                                ->label('Purchases')
                                ->translateLabel('Purchases')
                                ->content(fn(?Chapter $record): int => $record?->purchasedBy()->count() ?? 0),

                            Placeholder::make('revenue')
                                ->label('Revenue')
                                ->translateLabel('Revenue')
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
                    ->label('Comic')
                    ->translateLabel('Comic')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->translateLabel('Title')
                    ->sortable(),

                Tables\Columns\TextColumn::make('order')
                    ->sortable()
                    ->translateLabel('Order'),

                Tables\Columns\TextColumn::make('pricing')
                    ->money('VND')
                    ->label('Price')
                    ->translateLabel('Price')
                    ->sortable(),

                Tables\Columns\TextColumn::make('read_count')
                    ->sortable()
                    ->label('Read Count')
                    ->translateLabel('Read Count')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('vote_count')
                    ->sortable()
                    ->label('Vote Count')
                    ->translateLabel('Vote Count')
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
