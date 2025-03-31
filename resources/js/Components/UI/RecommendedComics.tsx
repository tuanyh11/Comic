// RecommendedComics.tsx
import { Comic } from '@/types/custom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FC } from 'react';
import ComicCard from '../Home/ComicCard';

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
                <ComicCard key={comic.id} comic={comic} />
            ))}
        </div>
    );
};

export default RecommendedComics;
