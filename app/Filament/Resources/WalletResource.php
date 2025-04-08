<?php

namespace App\Filament\Resources;

use App\Enums\CURRENCY;
use App\Filament\Resources\WalletResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Wallet;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WalletResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Wallet::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $navigationGroup = 'Financial Management';

    protected static ?int $navigationSort = 1;

    protected static function getLabelName(): string
    {
        return __('Wallet');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->translateLabel()
                    ->required(),

                Forms\Components\TextInput::make('balance')
                    ->numeric()
                    ->suffix('VND')
                    ->default(0)
                    ->translateLabel()
                    ->required()
                    ->helperText(
                        fn(\Filament\Forms\Get $get) =>
                        number_format((int)$get('balance'), 0, ',', '.') . ' VND'
                    ),

                Forms\Components\Select::make('currency')
                    ->options([
                        CURRENCY::getAll()
                    ])
                    ->searchable()
                    ->default(CURRENCY::VND->toString())
                    ->translateLabel()
                    ->required()
                    
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('balance')
                    ->money('VND')
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('currency')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('transactions_count')
                    ->counts('transactions')
                    ->label('Transactions')
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                // Tables\Actions\Action::make('add_funds')
                //     ->label('Add Funds')
                //     ->translateLabel()
                //     ->icon('heroicon-o-plus-circle')
                //     ->form([
                //         Forms\Components\TextInput::make('amount')
                //             ->label('Amount')
                //             ->translateLabel()
                //             ->numeric()
                //             ->suffix('VND')
                //             ->minValue(1)
                //             ->required(),

                //         Forms\Components\Textarea::make('description')
                //             ->label('Description')
                //             ->translateLabel()
                //             ->required(),
                //     ])
                //     ->action(function (Wallet $record, array $data): void {
                //         // Add funds to the wallet
                //         $record->balance += $data['amount'];
                //         $record->save();

                //         // Create transaction record
                //         $record->transactions()->create([
                //             'user_id' => $record->user_id,
                //             'transaction_id' => 'ADMIN-' . uniqid(),
                //             'type' => 'deposit',
                //             'amount' => $data['amount'],
                //             'balance_before' => $record->balance - $data['amount'],
                //             'balance_after' => $record->balance,
                //             'description' => $data['description'],
                //             'status' => 'completed',
                //             'metadata' => [
                //                 'method' => 'admin',
                //                 'admin_note' => $data['description'],
                //             ],
                //         ]);
                //     }),
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
            WalletResource\RelationManagers\TransactionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWallets::route('/'),
            'create' => Pages\CreateWallet::route('/create'),
            'edit' => Pages\EditWallet::route('/{record}/edit'),
        ];
    }
}
