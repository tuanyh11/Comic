<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    
    protected static ?string $navigationGroup = 'User Management';
    
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('User Information')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                            
                                Forms\Components\TextInput::make('email')
                                    ->email()
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true),
                            
                                Forms\Components\TextInput::make('password')
                                    ->password()
                                    ->dehydrateStateUsing(fn ($state) => 
                                        filled($state) ? Hash::make($state) : null)
                                    ->dehydrated(fn ($state) => filled($state))
                                    ->required(fn (string $operation): bool => $operation === 'create')
                                    ->maxLength(255),
                              
                            CuratorPicker::make('document_ids')
                                    ->multiple()
                                    ->label('Avatar')
                                    ->relationship('media', 'id')
                                    ->orderColumn('order') // Optional: Rename the order column if needed
                                    ->typeColumn('type') // Optional: Rename the type column if needed
                                    ->typeValue(User::class),
                                Forms\Components\TextInput::make('google_id')
                                    ->maxLength(255)
                                    ->visibleOn(['view'])
                                    ->disabled(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 2]),
                
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Roles & Permissions')
                            ->schema([
                                Forms\Components\CheckboxList::make('roles')
                                    ->relationship('roles', 'name')
                                    ->searchable()
                                    ->columnSpanFull(),
                            ]),
                        
                        Forms\Components\Section::make('Wallet')
                            ->schema([
                                Forms\Components\Placeholder::make('wallet_balance')
                                    ->label('Balance')
                                    // ->content(fn (User $record): string => 
                                    //     number_format($record->wallet?->balance ?? 0) . ' VND'),
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
                Tables\Columns\ImageColumn::make('thumbnail_url')
                    ->label('Avatar')
                    ->circular()
                    ->defaultImageUrl(fn () => asset('images/user-placeholder.jpg')),
                
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                
                
                Tables\Columns\TextColumn::make('wallet.balance')
                    ->money('VND')
                    ->sortable()
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('purchasedChapters.count')
                    ->counts('purchasedChapters')
                    ->label('Purchases')
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
                // Tables\Filters\SelectFilter::make('roles')
                //     ->relationship('roles', 'name')
                //     ->multiple()
                //     ->preload(),
                
                Tables\Filters\Filter::make('has_wallet')
                    ->query(fn (Builder $query): Builder => $query->has('wallet'))
                    ->label('Has Wallet'),
                
                Tables\Filters\Filter::make('has_purchases')
                    ->query(fn (Builder $query): Builder => $query->has('purchasedChapters'))
                    ->label('Has Purchases'),
                
                Tables\Filters\Filter::make('google_login')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('google_id'))
                    ->label('Google Login'),
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
            UserResource\RelationManagers\PurchasedChaptersRelationManager::class,
            UserResource\RelationManagers\PaymentsRelationManager::class,
            UserResource\RelationManagers\WalletTransactionsRelationManager::class,
            UserResource\RelationManagers\ReadHistoriesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}