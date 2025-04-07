<?php

namespace App\Lang\Traits;

trait HasTranslate
{

    abstract protected static function getLabelName(): string;
    public static function getNavigationLabel(): string
    {
        return __(self::getLabelName());
    }

    public static function getPluralLabel(): string
    {
        return __(self::getLabelName());
    }

    public static function getLabel(): string
    {
        return __(self::getLabelName());
    }
};
