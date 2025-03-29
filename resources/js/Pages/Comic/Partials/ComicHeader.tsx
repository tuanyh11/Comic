import { FC } from 'react';

interface ComicHeaderProps {
    title: string;
}

const ComicHeader: FC<ComicHeaderProps> = ({ title }) => {
    return (
        <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <div className="flex space-x-2 text-gray-500">
                <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
                    ⋮
                </button>
            </div>
        </div>
    );
};

export default ComicHeader;
