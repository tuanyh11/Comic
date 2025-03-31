import { Chapter, Comic } from '@/types/custom';
import formatCount from '@/utils/formatCount';
import { Link } from '@inertiajs/react';
import { BookOpen, Heart } from 'lucide-react';
import { FC } from 'react';

interface ComicCardProps {
    comic: Comic & Pick<Chapter, 'read_count' | 'vote_count'>;
}

const ComicCard: FC<ComicCardProps> = ({ comic }) => {
    const isUpdating =
        comic.chapters.length > 0 ? comic.status.name : 'Truyện đang cập nhật';
    return (
        <Link
            href={`/comic/${comic.id}`}
            className="group relative h-96 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
            {/* Full-size background image */}
            <img
                src={comic.media[0].media.url}
                alt={comic.title}
                className="absolute h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay gradient from top to bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/90" />

            {/* Status badge */}
            <span
                style={{
                    backgroundColor: `${comic.status.color}`,
                }}
                className={`absolute right-3 top-3 rounded-full border border-white/20 ${comic.chapters.length > 0 ? `` : 'bg-gradient-to-tr from-indigo-600 to-fuchsia-600'} px-3 py-1 text-xs font-medium text-white shadow-md`}
            >
                {isUpdating}
            </span>

            {/* Content area positioned at the bottom */}
            <div className="absolute bottom-0 w-full p-4">
                {/* Title and author info */}
                <h3 className="mb-1 truncate text-lg font-bold text-white/80">
                    {comic.title}
                </h3>
                <p className="mb-3 text-sm font-medium text-gray-200">
                    {comic.author.name}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-white/90 drop-shadow-lg">
                    <span className="flex items-center">
                        <BookOpen className="mr-1 h-4 w-4 stroke-blue-500" />
                        {formatCount(comic.read_count)}
                    </span>
                    <span className="flex items-center">
                        <Heart className="mr-1 h-4 w-4 stroke-pink-500" />
                        {formatCount(comic.vote_count)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ComicCard;
