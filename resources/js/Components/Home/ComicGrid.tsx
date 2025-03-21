// @/Components/Home/ComicGrid.tsx
import { Chapter, Comic } from '@/types/custom';
import { FC } from 'react';
import ComicCard from './ComicCard';

interface ComicGridProps {
    comics: (Comic & Pick<Chapter, 'read_count' | 'vote_count'>)[];
    // gridRef: React.RefObject<HTMLDivElement>;
}

const ComicGrid: FC<ComicGridProps> = ({ comics }) => {
    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {comics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
            ))}
        </div>
    );
};

export default ComicGrid;
