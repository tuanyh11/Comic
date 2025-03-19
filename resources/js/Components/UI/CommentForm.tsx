import { User } from '@/types/custom';
import { Send } from 'lucide-react';
import { FC } from 'react';
import Avatar from './Avatar';

interface CommentFormProps {
    user: User;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    placeholder?: string;
    rows?: number;
    onCancel?: () => void;
}

export const CommentForm: FC<CommentFormProps> = ({
    user,
    value,
    onChange,
    onSubmit,
    isSubmitting,
    placeholder = 'Thêm bình luận của bạn...',
    rows = 3,
    onCancel,
}) => {
    return (
        <div className="flex items-start space-x-3">
            <Avatar user={user} size={onCancel ? 'sm' : 'md'} />
            <div className="flex-grow">
                <textarea
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div className="mt-2 flex space-x-2">
                    <button
                        className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:from-blue-700 hover:to-pink-600'}`}
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Gửi
                            </>
                        )}
                    </button>
                    {onCancel && (
                        <button
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            onClick={onCancel}
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
