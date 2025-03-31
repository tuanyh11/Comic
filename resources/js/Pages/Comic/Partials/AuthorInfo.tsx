import { Comic } from '@/types/custom';
import { UserIcon } from 'lucide-react';
import { FC } from 'react';

interface AuthorInfoProps {
    comic: Comic;
    isFollowing: boolean;
    toggleFollow: () => void;
}

const AuthorInfo: FC<AuthorInfoProps> = ({
    comic,
    // isFollowing,
    // toggleFollow,
}) => {
    return (
        <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center">
                <div className="mr-4 flex aspect-square h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-lg uppercase text-white shadow-lg">
                    {comic.author.name[0]}
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-800">
                        {comic.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            <UserIcon className="h-3.5 w-3.5" /> Tác giả
                        </span>
                    </p>
                </div>
            </div>
            {/* Follow button code is commented out in the original, keeping it that way */}
            {/* <button
                onClick={toggleFollow}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    isFollowing
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg'
                }`}
            >
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button> */}
        </div>
    );
};

export default AuthorInfo;
