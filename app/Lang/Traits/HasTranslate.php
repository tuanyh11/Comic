<?php

namespace App\Lang\Traits;

trait HasTranslate
{

    public static function use_translate()
    {
        $resources = (require __DIR__ . '/../vi/filament-panels.php')['resources'];
        return $resources[class_basename(static::class)]['label'] ?? class_basename(static::class);
    }

    public static function getNavigationLabel(): string
    {
        return self::use_translate();
    }
};
