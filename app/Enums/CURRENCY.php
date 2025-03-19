<?php

namespace App\Enums;

enum CURRENCY: string
{
    case VND = 'VND';
    public function toString(): string
    {
        return $this->value;
    }

    static public function getAll() {
        return array_column(self::cases(), 'value');
    }
};
