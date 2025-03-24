// RecommendedComics.tsx
import { Comic } from '@/types/custom';
import { Link } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BookOpen, HeartIcon } from 'lucide-react';
import { FC } from 'react';

interface RecommendedComicsProps {
    currentComicId: number;
    tagIds?: number[];
}

const RecommendedComics: FC<RecommendedComicsProps> = ({
    currentComicId,
    tagIds = [],
}) => {
    // Fetch recommendations using React Query
    const { data: recommendations = [], isLoading } = useQuery({
        queryKey: ['comicRecommendations', currentComicId, tagIds],
        queryFn: async () => {
            const response = await axios.get('/api/comics/recommendations', {
                params: {
                    comic_id: currentComicId,
                    tag_ids: tagIds.join(','),
                    limit: 4,
                },
            });

            return response.data as Comic[];
        },
        // Options
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        retry: 2, // Retry failed requests twice
    });

    console.log('====================================');
    console.log(recommendations);
    console.log('====================================');
    // Hiển thị skeleton loader khi đang tải
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-xl bg-white shadow-lg"
                    >
                        <div className="relative aspect-[2/3] animate-pulse bg-gray-200"></div>
                        <div className="p-4">
                            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {recommendations.map((comic) => (
                <Link
                    key={comic.id}
                    href={`/comic/${comic.id}`}
                    className="overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 hover:scale-[1.03]"
                >
                    <div className="relative aspect-[2/3] bg-gray-300">
                        <img
                            src={
                                comic.media.length > 0
                                    ? comic.media[0].media.url
                                    : ''
                            }
                            alt={comic.title}
                            className="h-full w-full object-cover"
                        />
                        {comic.status === 'ongoing' && (
                            <div className="absolute left-0 top-2 rounded-r-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white shadow-md">
                                Đang cập nhật
                            </div>
                        )}
                        {comic.is_featured && (
                            <div className="absolute left-0 top-2 rounded-r-full bg-pink-500 px-3 py-0.5 text-xs font-medium text-white shadow-md">
                                Hot
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="line-clamp-1 font-semibold text-gray-800 transition-colors hover:text-blue-600">
                            {comic.title}
                        </h3>
                        <p className="line-clamp-1 text-sm text-gray-500">
                            bởi {comic.author?.name || 'Unknown Author'}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-700">
                            <span className="mr-3 flex items-center">
                                <BookOpen className="mr-1 h-3 w-3 text-blue-500" />
                                {(comic.read_count || 0).toLocaleString()}
                            </span>
                            <span className="flex items-center">
                                <HeartIcon className="mr-1 h-3 w-3 text-pink-500" />
                                {(comic.vote_count || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RecommendedComics;
