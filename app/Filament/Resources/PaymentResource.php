<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PaymentResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Payment::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    
    protected static ?string $navigationGroup = 'Financial Management';
    
    protected static ?int $navigationSort = 2;

    protected static function getLabelName(): string
    {
        return __('Payment');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Payment Information'))
                            ->schema([
                                Forms\Components\Select::make('user_id')
                                    ->relationship('user', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Select::make('chapter_id')
                                    ->relationship('chapter', 'title')
                                    ->searchable()
                                    ->preload()
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('transaction_id')
                                    ->maxLength(255)
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Select::make('payment_method')
                                    ->options([
                                        'wallet' => 'Wallet',
                                        'credit_card' => 'Credit Card',
                                        'bank_transfer' => 'Bank Transfer',
                                        'paypal' => 'PayPal',
                                        'momo' => 'MoMo',
                                        'zalopay' => 'ZaloPay',
                                    ])
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\TextInput::make('amount')
                                    ->numeric()
                                    ->suffix('VND')
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Select::make('currency')
                                    ->options([
                                        'VND' => 'Vietnamese Dong (VND)',
                                        'USD' => 'US Dollar (USD)',
                                        'EUR' => 'Euro (EUR)',
                                    ])
                                    ->default('VND')
                                    ->translateLabel()
                                    ->required(),
                                
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'completed' => 'Completed',
                                        'failed' => 'Failed',
                                        'refunded' => 'Refunded',
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
                
                Tables\Columns\TextColumn::make('chapter.title')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('transaction_id')
                    ->searchable()
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('payment_method')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('amount')
                    ->money('VND')
                    ->translateLabel()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->translateLabel()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'gray',
                    }),
                
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
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        'wallet' => 'Wallet',
                        'credit_card' => 'Credit Card',
                        'bank_transfer' => 'Bank Transfer',
                        'paypal' => 'PayPal',
                        'momo' => 'MoMo',
                        'zalopay' => 'ZaloPay',
                    ])
                    ->translateLabel(),
                
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
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
            'index' => Pages\ListPayments::route('/'),
            'create' => Pages\CreatePayment::route('/create'),
            'edit' => Pages\EditPayment::route('/{record}/edit'),
        ];
    }
}