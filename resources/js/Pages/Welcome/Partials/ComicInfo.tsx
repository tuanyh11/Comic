import { Comic } from '@/types/custom';
import React from 'react';
import ActionButtons from './ActionButtons';
import ComicDescription from './ComicDescription';
import ComicGenres from './ComicGenres';
import ComicStats from './ComicStats';
import ComicTags from './ComicTags';

interface ComicInfoProps {
    comic: Comic;
}

const ComicInfo: React.FC<ComicInfoProps> = ({ comic }) => {
    return (
        <div className="relative z-20 flex max-w-4xl flex-col justify-center px-8 pt-20 pt-[10vh] md:px-12 lg:px-16">
            <h1 className="mb-2 line-clamp-2 text-4xl font-bold text-white transition-all duration-500 md:text-6xl">
                {comic.title}
            </h1>

            <ComicStats comic={comic} />
            <ComicGenres comic={comic} />
            <ComicTags comic={comic} />
            <ComicDescription description={comic.description} />
            <ActionButtons />
        </div>
    );
};

export default ComicInfo;
