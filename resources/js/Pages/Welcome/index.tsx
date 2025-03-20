import { Comic } from '@/types/custom';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ComicBackground from './Partials/ComicBackground';
import ComicCarousel from './Partials/ComicCarousel';
import ComicInfo from './Partials/ComicInfo';
import Navbar from './Partials/Navbar';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
    featuredComic: Comic;
    comicList: Comic[];
}

export default function Welcome({ featuredComic, comicList }: Props) {
    const [currentComic, setCurrentComic] = useState<Comic>(featuredComic);

    return (
        <>
            <Head title="Comic Collection" />
            <div className="relative min-h-screen text-white">
                <div className="relative h-full">
                    <Navbar />
                    <ComicBackground comic={currentComic} />
                    <ComicInfo comic={currentComic} />
                    <ComicCarousel
                        comicList={comicList}
                        initialComic={featuredComic}
                        onComicSelect={setCurrentComic}
                    />
                </div>
            </div>
        </>
    );
}
