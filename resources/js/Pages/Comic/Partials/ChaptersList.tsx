import { Chapter, Comic } from '@/types/custom';
import { BookOpen, EyeIcon, MessagesSquare } from 'lucide-react';
import { FC } from 'react';

interface ChaptersListProps {
    comic: Comic;
    handleChapterClick: (chapter: Chapter) => void;
    handlePreviewChapter: (chapter: Chapter) => void;
}

const ChaptersList: FC<ChaptersListProps> = ({
    comic,
    handleChapterClick,
    handlePreviewChapter,
}) => {
    return (
        <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Danh sách chương
            </h2>
            <div className="space-y-3 overflow-hidden rounded-lg">
                {comic.chapters.map((chapter) => {
                    // Kiểm tra xem chapter có phải trả phí không
                    const isPaid = chapter.pricing > 0;
                    // Kiểm tra xem chapter đã được mở khóa chưa
                    const isUnlocked = chapter.is_unlocked === true;
                    // Kiểm tra xem chapter đã đọc chưa
                    const isRead = chapter.is_read === true;
                    const isOngoing = chapter?.media?.[0];
                    return (
                        <div key={chapter.id} className="relative">
                            {!isOngoing && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center text-sm font-semibold">
                                    Xin lỗi đã làm phiền chúng tôi đang cập nhật
                                    chương này
                                </div>
                            )}
                            <div
                                className={`flex cursor-pointer flex-col p-4 transition-colors hover:bg-blue-50 ${
                                    isPaid && !isUnlocked
                                        ? 'bg-gray-50'
                                        : isRead
                                          ? 'bg-blue-50'
                                          : ''
                                } ${!isOngoing ? '! pointer-events-none blur-md' : ''} `}
                                onClick={() => handleChapterClick(chapter)}
                            >
                                {/* Phần trên: Tiêu đề chương và thông tin cập nhật */}
                                <div className="w-full">
                                    <p className="line-clamp-2 font-medium text-gray-800">
                                        Chương {chapter.order}: {chapter.title}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Cập nhật:{' '}
                                        {new Date(
                                            chapter.updated_at,
                                        ).toLocaleDateString('vi-VN')}
                                    </p>

                                    {/* Hàng mới cho giá tiền và nút đọc thử */}
                                    {isPaid && !isUnlocked && (
                                        <div className="mt-2 flex items-center gap-3">
                                            <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                {chapter.pricing}đ
                                            </span>

                                            {/* Nút Đọc thử */}
                                            {isOngoing && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePreviewChapter(
                                                            chapter,
                                                        );
                                                    }}
                                                    className="flex flex-shrink-0 items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                                                >
                                                    <EyeIcon className="mr-1 h-3 w-3" />
                                                    Đọc thử
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Phần dưới: Thống kê lượt đọc và bình luận */}
                                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-blue-500" />
                                        {chapter.read_count.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MessagesSquare className="h-4 w-4 text-blue-500" />
                                        {chapter.comments_count.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {comic.chapters.length > 4 && (
                    <button className="w-full py-3 text-center font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800">
                        Xem tất cả {comic.chapters.length} chương
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChaptersList;
