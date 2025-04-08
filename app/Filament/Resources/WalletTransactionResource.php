<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WalletTransactionResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\WalletTransaction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WalletTransactionResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = WalletTransaction::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    
    protected static ?string $navigationGroup = 'Financial Management';
    
    protected static ?int $navigationSort = 3;
    

    protected static function getLabelName(): string
    {
        return __('Wallet Transaction');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Information'))
                            ->translateLabel()
                            ->schema([
                                Forms\Components\Select::make('wallet_id')
                                    ->relationship('wallet', 'id', fn ($query) => $query->with('user'))
                                    ->getOptionLabelFromRecordUsing(fn ($record) => "ID: {$record->id} - User: {$record->user->name}")
                                    ->searchable()
                                    ->preload()
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Select::make('user_id')
                                    ->relationship('user', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('transaction_id')
                                    ->maxLength(255)
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Select::make('type')
                                    ->options([
                                        'deposit' => 'Deposit',
                                        'withdrawal' => 'Withdrawal',
                                        'purchase' => 'Purchase',
                                        'refund' => 'Refund',
                                        'transfer' => 'Transfer',
                                    ])
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('amount')
                                    ->numeric()
                                    ->suffix('VND')
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('balance_before')
                                    ->numeric()
                                    ->suffix('VND')
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('balance_after')
                                    ->numeric()
                                    ->suffix('VND')
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Textarea::make('description')
                                    ->maxLength(65535)
                                    ->translateLabel()
                                    ->columnSpanFull(),
                                
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'completed' => 'Completed',
                                        'failed' => 'Failed',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->default('completed')
                                    ->translateLabel()
                                    ->required(),
                            ])->columns(2),
                    ])
                    ->columnSpan(['lg' => 2]),
                
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Metadata'))
                            ->translateLabel()
                            ->schema([
                                Forms\Components\KeyValue::make('metadata')
                                    ->keyLabel('Key')
                                    ->valueLabel('Value')
                                    ->translateLabel()
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('transaction_id')
                    ->searchable()
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->translateLabel()
                    ->color(fn (string $state): string => match ($state) {
                        'deposit' => 'success',
                        'withdrawal' => 'warning',
                        'purchase' => 'danger',
                        'refund' => 'info',
                        'transfer' => 'gray',
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('amount')
                    ->money('VND')
                    ->translateLabel()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('balance_before')
                    ->money('VND')
                    ->translateLabel()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('balance_after')
                    ->money('VND')
                    ->translateLabel()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->translateLabel()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        'cancelled' => 'gray',
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('description')
                    ->limit(30)
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->translateLabel()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->translateLabel()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'deposit' => 'Deposit',
                        'withdrawal' => 'Withdrawal',
                        'purchase' => 'Purchase',
                        'refund' => 'Refund',
                        'transfer' => 'Transfer',
                    ])
                    ->translateLabel(),
                
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->translateLabel(),
                
                Tables\Filters\SelectFilter::make('user')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->translateLabel()
                    ->preload(),
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
            'index' => Pages\ListWalletTransactions::route('/'),
            'create' => Pages\CreateWalletTransaction::route('/create'),
            // 'view' => Pages\ViewWalletTransaction::route('/{record}'),
            'edit' => Pages\EditWalletTransaction::route('/{record}/edit'),
        ];
    }
}