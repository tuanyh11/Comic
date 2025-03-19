<div>
     <div class="flex flex-col justify-center px-2 py-3 col-4">
        <div >
            <div  class="w-10 h-10  flex">
                <img src="{{ url('/storage/'.$key.'/'.($file_name).'') }}" alt="{{ $name }}" role="img" class="h-full w-full overflow-hidden shadow object-cover" />
            </div>
        </div>
 
        <div class="flex flex-col justify-center pl-3 py-2 ">
            <p class="text-sm font-bold pb-1">{{ $name }}</p>
            {{-- <div class="flex flex-col items-start">
                <p class="text-xs leading-5">{{ $email }}</p>
            </div> --}}
        </div>
    </div>
</div>
