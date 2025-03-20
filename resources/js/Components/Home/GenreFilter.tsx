// @/Components/Home/GenreFilter.tsx
import { Genre } from '@/types/custom';
import { FC } from 'react';

interface GenreFilterProps {
    genres: Genre[];
}

const GenreFilter: FC<GenreFilterProps> = ({ genres }) => {
    return (
        <div className="mb-8 flex space-x-4 overflow-x-auto py-2">
            {genres.map((genre) => (
                <button
                    key={genre.id}
                    className="rounded-full border bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default GenreFilter;
