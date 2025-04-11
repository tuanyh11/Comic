import { Comic } from '@/types/custom';
import { generateColorFromName } from '@/utils/colorUtils';
import { FC } from 'react';

interface AvatarProps {
    user: Comic['author'];
}

const AuthorAvatar: FC<AvatarProps> = ({ user }) => {
    if (user.media[0]?.media.url) {
        return (
            <div
                className={`aspect-square w-14 flex-shrink-0 overflow-hidden rounded-full shadow-lg`}
            >
                <img
                    src={`${user.media[0]?.media.url}`}
                    alt={`${user.name}'s avatar`}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    // Get first letter of name and background color
    const firstLetter = user.name.charAt(0).toUpperCase();
    const bgColor = generateColorFromName(user.name);

    return (
        <div
            className={`sticky flex-shrink-0 items-center justify-center rounded-full shadow-lg drop-shadow-sm backdrop-blur-lg ${bgColor} flex`}
        >
            <span className="font-medium text-white">{firstLetter}</span>
        </div>
    );
};

export default AuthorAvatar;
