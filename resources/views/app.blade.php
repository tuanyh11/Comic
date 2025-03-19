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

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead

</head>

<body class="font-sans antialiased">
 
    {{-- <div style="display: none" class="_df_book" height="500" webgl="true" backgroundcolor="teal" source="http://127.0.0.1:8000/storage/media/ad84d5dd-1185-4a34-9cdd-a3ef15168772.pdf"
      id="df_manual_book">
    </div> --}}
   
    @inertia
</body>
<script defer src="{{ asset('js/dflip/js/libs/jquery.min.js') }}"></script>
<script defer src="{{ asset('js/dflip/js/dflip.min.js') }}"></script>

</html>