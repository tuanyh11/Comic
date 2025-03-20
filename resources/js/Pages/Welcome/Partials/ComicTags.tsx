import { Comic } from '@/types/custom';
import React from 'react';

interface ComicTagsProps {
    comic: Comic;
}

const ComicTags: React.FC<ComicTagsProps> = ({ comic }) => {
    if (!comic.tags || comic.tags.length === 0) return null;

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {comic.tags.map((tag) => (
                <span
                    key={tag.id}
                    className="rounded-full border border-pink-400/30 bg-pink-500/20 px-3 py-1 text-xs text-pink-200 backdrop-blur-sm"
                >
                    #{tag.name}
                </span>
            ))}
        </div>
    );
};

export default ComicTags;
