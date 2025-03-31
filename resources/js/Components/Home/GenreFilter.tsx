// @/Components/Home/GenreFilter.tsx
import { PageProps } from '@/types';
import { Genre } from '@/types/custom';
import { router, usePage } from '@inertiajs/react';
import { Filter, Tag, X } from 'lucide-react';
import { FC, useState } from 'react';

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
    const [isExpanded, setIsExpanded] = useState(false);

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

    const clearAllFilters = () => {
        router.get(
            route('home'),
            { tab: activeTab },
            {
                onSuccess: scrollToView,
            },
        );
    };

    const scrollToView = () =>
        gridRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Get a subset of genres for the collapsed view
    const displayedGenres = isExpanded ? genres : genres.slice(0, 8);

    return (
        <div id="home-genre" className="mb-10">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Tag className="h-5 w-5 text-indigo-600" />
                    Thể loại
                </div>
                <div className="flex items-center gap-3">
                    {activeGenreId && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                            <X className="h-4 w-4" />
                            Xóa bộ lọc
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                    >
                        <Filter className="h-4 w-4" />
                        {isExpanded ? 'Thu gọn' : 'Xem tất cả'}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {displayedGenres.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => handleGenreClick(genre)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                            activeGenreId === genre.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-indigo-500/30'
                                : 'bg-white shadow-md hover:bg-gray-50 hover:shadow-lg'
                        }`}
                    >
                        {genre.name}
                    </button>
                ))}

                {!isExpanded && genres.length > 8 && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                    >
                        +{genres.length - 8} thể loại
                    </button>
                )}
            </div>
        </div>
    );
};

export default GenreFilter;
