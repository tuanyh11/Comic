import { Comic } from '@/types/custom';
import { FC } from 'react';

interface ComicTagsProps {
    tags: Comic['tags'];
}

const ComicTags: FC<ComicTagsProps> = ({ tags }) => {
    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((item) => (
                <span
                    key={item.id}
                    className="cursor-pointer rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                >
                    #{item.name}
                </span>
            ))}
        </div>
    );
};

export default ComicTags;
