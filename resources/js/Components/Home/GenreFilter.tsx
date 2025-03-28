// @/Components/Home/GenreFilter.tsx
import { PageProps } from '@/types';
import { Genre } from '@/types/custom';
import { router, usePage } from '@inertiajs/react';
import { FC } from 'react';

interface GenreFilterProps {
    genres: Genre[];
    gridRef: React.RefObject<HTMLDivElement>;
}

interface CustomPageProps extends PageProps {
    genreFilters: string;
    activeTab: string;
}

const GenreFilter: FC<GenreFilterProps> = ({ genres, gridRef }) => {
    const { genreFilters, activeTab } = usePage<CustomPageProps>().props;

    const activeGenreId = genreFilters ? parseInt(genreFilters) : null;

    const handleGenreClick = (genre: Genre) => {
        const params: { genre?: number; tab?: string } = { tab: activeTab };

        if (activeGenreId !== genre.id) {
            // Apply the filter
            params.genre = genre.id;
        }

        router.get(route('home'), params, {
            onSuccess: scrollToView,
        });
    };

    const scrollToView = () =>
        gridRef.current?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div
            id="home-genre"
            className="mb-8 flex space-x-4 overflow-x-auto py-2"
        >
            {genres.map((genre) => (
                <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre)}
                    className={`rounded-full border px-4 py-2 text-sm shadow-sm transition-colors ${
                        activeGenreId === genre.id
                            ? 'border-blue-500 bg-blue-100 text-blue-700'
                            : 'bg-white hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default GenreFilter;
