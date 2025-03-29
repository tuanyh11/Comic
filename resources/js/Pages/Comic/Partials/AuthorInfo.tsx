import { Comic } from '@/types/custom';
import { FC } from 'react';

interface AuthorInfoProps {
    comic: Comic;
    isFollowing: boolean;
    toggleFollow: () => void;
}

const AuthorInfo: FC<AuthorInfoProps> = ({
    comic,
    isFollowing,
    toggleFollow,
}) => {
    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="mr-3 flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-pink-500 uppercase text-white shadow-md">
                    <span>{comic.author.name[0]}</span>
                </div>
                <div>
                    <p className="font-semibold text-gray-800">
                        {comic.author.name}
                    </p>
                    <p className="text-xs text-gray-500">Tác giả</p>
                </div>
            </div>
            {/* <button
                onClick={toggleFollow}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    isFollowing
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                }`}
            >
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button> */}
        </div>
    );
};

export default AuthorInfo;
