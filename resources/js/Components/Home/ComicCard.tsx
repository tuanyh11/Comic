// @/Components/Home/ComicCard.tsx
import { Chapter, Comic } from '@/types/custom';
import formatCount from '@/utils/formatCount';
import { Link } from '@inertiajs/react';
import { BookOpen, Heart } from 'lucide-react';
import { FC } from 'react';

interface ComicCardProps {
    comic: Comic & Pick<Chapter, 'read_count' | 'vote_count'>;
}

const ComicCard: FC<ComicCardProps> = ({ comic }) => {
    return (
        <Link
            href={`/comic/${comic.id}`}
            className="overflow-hidden rounded-xl bg-white pt-4 shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
        >
            <div className="book-container py-4">
                <div className="book">
                    <img
                        src={comic.media[0].media.url}
                        alt={comic.title}
                        className="h-56 w-full object-cover"
                    />
                </div>
            </div>
            <div className="p-4">
                <h3 className="mb-2 truncate text-lg font-bold text-gray-800">
                    {comic.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                    {comic.author.name}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex space-x-3">
                        {comic.status === 'ongoing' && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                {comic.status}
                            </span>
                        )}
                        <span className="flex items-center">
                            <Heart className="mr-1 h-4 w-4 text-pink-500" />{' '}
                            {formatCount(comic.vote_count)}
                        </span>
                        <span className="flex items-center">
                            <BookOpen className="mr-1 h-4 w-4 text-blue-500" />{' '}
                            {formatCount(comic.read_count)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ComicCard;
