<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StatusResource\Pages;
use App\Lang\Traits\HasTranslate;
use App\Models\Status;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class StatusResource extends Resource
{
    use HasTranslate;
    protected static ?string $model = Status::class;

    protected static ?string $navigationIcon = 'heroicon-o-flag';

    protected static ?string $navigationGroup = 'Taxonomy';

    protected static ?int $navigationSort = 3;

    protected static function getLabelName(): string
    {
        return __('Status');
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Status Information')
                    ->translateLabel()
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->translateLabel()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn(Forms\Get $get, Forms\Set $set, ?string $state) =>
                            $set('slug', Str::slug($state))),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->translateLabel()
                            ->unique(Status::class, 'slug', ignoreRecord: true),

                        Forms\Components\ColorPicker::make('color')
                            ->required()
                            ->translateLabel(),

                        Forms\Components\Textarea::make('description')
                            ->maxLength(65535)
                            ->translateLabel(),

                        Forms\Components\Toggle::make('is_default')
                            ->label('Set as default status')
                            ->translateLabel()
                            ->helperText(__('Only one status can be set as default')),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->translateLabel()
                    ->sortable(),

                Tables\Columns\ColorColumn::make('color')
                    ->translateLabel(),

                Tables\Columns\IconColumn::make('is_default')
                    ->boolean()
                    ->translateLabel(),

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
                    ->sortable()
                    ->translateLabel()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function (Status $record) {
                        // Đảm bảo không xóa status mặc định nếu chưa có status khác làm mặc định
                        if ($record->is_default && Status::where('is_default', true)->count() <= 1) {
                            // Hiển thị thông báo lỗi và ngăn xóa
                            throw new \Exception("Cannot delete the only default status. Please set another status as default first.");
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStatuses::route('/'),
            'create' => Pages\CreateStatus::route('/create'),
            'edit' => Pages\EditStatus::route('/{record}/edit'),
        ];
    }
}