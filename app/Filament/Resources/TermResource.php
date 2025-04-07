<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TermResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Term;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class TermResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Term::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationGroup = 'Content Management';
    
    protected static ?int $navigationSort = 5;

    protected static ?string $recordTitleAttribute = 'title';


    protected static function getLabelName(): string
    {
        return __('Terms');
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Basic Information')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->translateLabel()
                                    ->maxLength(255),
                                
                                Forms\Components\Select::make('type')
                                    ->options([
                                        'terms_of_service' => 'Terms of Service',
                                        'privacy_policy' => 'Privacy Policy',
                                        'community_guidelines' => 'Community Guidelines',
                                        'payment_policy' => 'Payment Policy',
                                        'refund_policy' => 'Refund Policy',
                                        'other' => 'Other'
                                    ])
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('version')
                                    ->translateLabel()
                                    ->numeric()
                                    ->default(1)
                                    ->required(),
                                
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true)
                                    ->helperText(__('Only one active document per type is recommended')),
                                
                                Forms\Components\DateTimePicker::make('published_at')
                                    ->label('Publish Date')
                                    ->translateLabel()
                                    ->default(now()),
                            ])->columns(2),
                        
                        Forms\Components\Section::make(__('Content'))
                            ->schema([
                                Forms\Components\RichEditor::make('content')
                                    ->required()
                                    ->toolbarButtons([
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strike',
                                        'link',
                                        'h2',
                                        'h3',
                                        'paragraph',
                                        'blockquote',
                                        'bulletList',
                                        'orderedList',
                                        'redo',
                                        'undo',
                                    ])
                                    ->translateLabel()
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 3]),
                
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->translateLabel(true)
                    ->sortable(),
                
                Tables\Columns\SelectColumn::make('type')
                    ->options([
                        'terms_of_service' => 'Terms of Service',
                        'privacy_policy' => 'Privacy Policy',
                        'community_guidelines' => 'Community Guidelines',
                        'payment_policy' => 'Payment Policy',
                        'refund_policy' => 'Refund Policy',
                        'other' => 'Other'
                    ])
                    ->translateLabel(true)
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('version')
                    ->numeric()
                    ->translateLabel(true)
                    ->sortable(),
                
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active')
                    ->translateLabel(true)
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('published_at')
                    ->dateTime()
                    ->translateLabel(true)
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
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'terms_of_service' => 'Terms of Service',
                        'privacy_policy' => 'Privacy Policy',
                        'community_guidelines' => 'Community Guidelines',
                        'payment_policy' => 'Payment Policy',
                        'refund_policy' => 'Refund Policy',
                        'other' => 'Other'
                    ]),
                
                Tables\Filters\Filter::make('is_active')
                    ->query(fn (Builder $query): Builder => $query->where('is_active', true))
                    ->label('Active Only')
                    ->toggle(),
                
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('published_at', 'desc');
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
            'index' => Pages\ListTerms::route('/'),
            'create' => Pages\CreateTerm::route('/create'),
            // 'view' => Pages\ViewTerm::route('/{record}'),
            'edit' => Pages\EditTerm::route('/{record}/edit'),
        ];
    }
}