import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { FC } from 'react';

interface FloatingButtonsProps {
    onToggleComments: () => void;
    onVote: () => void;
    isVoted: boolean;
}

const FloatingButtons: FC<FloatingButtonsProps> = ({
    onToggleComments,
    onVote,
    isVoted = false,
}) => {
    return (
        <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-3">
            <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                onClick={() => window.history.back()}
                title="Quay lại"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>

            <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                onClick={onToggleComments}
                title="Bình luận"
            >
                <MessageCircle className="h-5 w-5" />
            </button>

            <button
                onClick={onVote}
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                    isVoted
                        ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:from-blue-600 hover:to-pink-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-all`}
                title="Thích"
            >
                <Heart className={`h-5 w-5 ${isVoted ? 'fill-white' : ''}`} />
            </button>
        </div>
    );
};

export default FloatingButtons;
