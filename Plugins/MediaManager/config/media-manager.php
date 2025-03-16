<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Disk
    |--------------------------------------------------------------------------
    |
    | Disk sử dụng để lưu trữ media files
    |
    */
    'disk' => env('MEDIA_MANAGER_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Directory
    |--------------------------------------------------------------------------
    |
    | Thư mục con để lưu media files
    |
    */
    'directory' => env('MEDIA_MANAGER_DIRECTORY', 'media'),

    /*
    |--------------------------------------------------------------------------
    | Allowed file types
    |--------------------------------------------------------------------------
    |
    | Các loại file được phép upload
    |
    */
    'allowed_file_types' => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
        'video/mp4',
        'audio/mpeg',
    ],

    /*
    |--------------------------------------------------------------------------
    | Max file size
    |--------------------------------------------------------------------------
    |
    | Kích thước file tối đa được phép upload (bytes)
    |
    */
    'max_file_size' => env('MEDIA_MANAGER_MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB

    /*
    |--------------------------------------------------------------------------
    | Thumbnails
    |--------------------------------------------------------------------------
    |
    | Cấu hình kích thước cho thumbnails
    |
    */
    'thumbnails' => [
        'width' => 200,
        'height' => 200,
        'fit' => 'crop', // options: contain, max, fill, stretch, crop
    ],
];