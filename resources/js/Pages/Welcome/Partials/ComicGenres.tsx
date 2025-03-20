import { Comic } from '@/types/custom';
import React from 'react';

interface ComicGenresProps {
    comic: Comic;
}

const ComicGenres: React.FC<ComicGenresProps> = ({ comic }) => {
    if (!comic.genres || comic.genres.length === 0) return null;

    return (
        <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-300">Thể loại:</span>
                {comic.genres.map((genre) => (
                    <span
                        key={genre.id}
                        className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-200 backdrop-blur-sm"
                    >
                        {genre.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ComicGenres;
