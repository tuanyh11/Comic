import { CheckCircle } from 'lucide-react';
import { FC } from 'react';

interface ChapterBadgeProps {
    isRead: boolean;
    order: number;
}

const ChapterBadge: FC<ChapterBadgeProps> = ({ isRead }) => {
    if (isRead) {
        return (
            <div className="absolute bottom-4 right-5 flex h-6 w-auto items-center justify-center rounded-full bg-green-100 px-2 text-xs font-bold text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" />
                Đã đọc
            </div>
        );
    }

    return null;
};

export default ChapterBadge;
