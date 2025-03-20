import { Comic } from '@/types/custom';
import React from 'react';

interface ComicBackgroundProps {
    comic: Comic;
}

const ComicBackground: React.FC<ComicBackgroundProps> = ({ comic }) => {
    return (
        <>
            {/* Background Image with fade transition */}
            <div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700">
                {comic?.media?.length > 0 ? (
                    <div className="relative h-full w-full">
                        <img
                            src={comic.thumbnail.url}
                            alt={comic.thumbnail.alt}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-pink-900/40 mix-blend-multiply"></div>
                    </div>
                ) : (
                    <div className="h-full w-full bg-gradient-to-r from-blue-900 to-pink-900"></div>
                )}
            </div>

            {/* Overlay Gradient */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-blue-900/90 via-black/70 to-transparent"></div>
        </>
    );
};

export default ComicBackground;
