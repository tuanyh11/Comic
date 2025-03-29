<?php 

namespace App\Lang;
abstract class Translate {
    protected static $langs = require __DIR__ .'/vi/filament-panels.php';
    
    public static function use_translate() {
        dump(self::$langs);
    }
}

; ?>