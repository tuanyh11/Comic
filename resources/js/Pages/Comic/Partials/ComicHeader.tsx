import { FC } from 'react';

interface ComicHeaderProps {
    title: string;
}

const ComicHeader: FC<ComicHeaderProps> = ({ title }) => {
    return (
        <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>
    );
};

export default ComicHeader;
