<div>
    <style>
        @layer table-image {
            .aspect-square {
                aspect-ratio: 1;
            }
            .object-cover {
                object-fit: cover;
            }

            .shadow {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .relative {
                position: relative;
            }

            .table-des {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 0.5rem;
                line-clamp: 2;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                backdrop-filter: blur(5px);
                font-size: 0.8rem;
            }
        }
    </style>
    <div class="relative">
        <img class="w-full aspect-square object-cover shadow"  src="/storage/{{ $getState() }}" alt="">
        {{-- <div class="table-des">
            <span>{{$getRecord()->name}}</span>
        </div> --}}
    </div>
</div>
