import { User } from '@/types/custom';
import { generateColorFromName } from '@/utils/colorUtils';
import { FC } from 'react';

interface AvatarProps {
    user: Omit<User, 'email'>;
    size: 'sm' | 'md'; // sm for replies, md for main comments
}

const Avatar: FC<AvatarProps> = ({ user, size }) => {
    const sizeClasses = size === 'md' ? 'h-8 w-8' : 'h-6 w-6';
    if (user.avatar) {
        return (
            <div
                className={`${sizeClasses} flex-shrink-0 overflow-hidden rounded-full`}
            >
                <img
                    src={user.avatar.url}
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
            className={`${sizeClasses} sticky flex-shrink-0 items-center justify-center rounded-full shadow-lg drop-shadow-sm backdrop-blur-lg ${bgColor} flex`}
        >
            <span className="font-medium text-white">{firstLetter}</span>
        </div>
    );
};

export default Avatar;
