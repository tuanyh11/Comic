<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('js/dflip/css/dflip.min.css') }}">
    <link rel="stylesheet" href="{{ asset('js/dflip/css/themify-icons.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/filament/filament/app.css')}}">
    <style>
        ._df_book {
            background: transparent !important;
            height: 100vh !important;
        }

        body {
            min-height: 100dvh;
        }
    </style>
</head>

<body class="font-sans antialiased">

    <div class="_df_book" webgl="true" backgroundcolor="teal" source={{$chapter->media[0]->media->url}} startpage="1"
        endpage="5" id="df_manual_book">
    </div>

</body>
<script src="{{ asset('js/dflip/js/libs/jquery.min.js') }}"></script>
<script src="{{ asset('js/dflip/js/dflip.min.js') }}"></script>
<script>
    console.log(DFLIP.defaults.pageSize);
    
    DFLIP.defaults.onReady = function (app) {
        app.target.endPage = 10
    };


</script>

</html>