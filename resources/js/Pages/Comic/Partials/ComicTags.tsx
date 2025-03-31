import { Comic } from '@/types/custom';
import { TagIcon } from 'lucide-react';
import { FC } from 'react';

interface ComicTagsProps {
    tags: Comic['tags'];
}

const ComicTags: FC<ComicTagsProps> = ({ tags }) => {
    return (
        <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((item) => (
                    <span
                        key={item.id}
                        className="cursor-pointer rounded-lg bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-all duration-300 hover:from-indigo-100 hover:to-fuchsia-100 hover:shadow-md"
                    >
                        #{item.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ComicTags;
