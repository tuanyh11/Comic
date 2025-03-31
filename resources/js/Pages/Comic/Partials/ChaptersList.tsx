import { Chapter, Comic } from '@/types/custom';
import {
    BookOpen,
    CalendarIcon,
    EyeIcon,
    LockIcon,
    MessagesSquare,
    UnlockIcon,
} from 'lucide-react';
import { FC } from 'react';
import ChapterBadge from './ChapterBadge';

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
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Danh sách chương
            </h2>
            <div className="space-y-3 overflow-hidden rounded-xl border border-indigo-100 shadow-md">
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
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/30 text-sm font-bold text-white backdrop-blur-sm">
                                    Xin lỗi, chương này đang được cập nhật
                                </div>
                            )}
                            <div
                                className={`relative flex cursor-pointer flex-col p-5 transition-all duration-300 hover:bg-indigo-50 ${
                                    isPaid && !isUnlocked
                                        ? 'bg-gray-50'
                                        : isRead
                                          ? 'bg-green-50/70'
                                          : 'bg-white'
                                } ${!isOngoing ? 'pointer-events-none blur-sm' : ''} border-b border-indigo-100 last:border-b-0`}
                                onClick={() => handleChapterClick(chapter)}
                            >
                                {isRead && (
                                    <div className="absolute left-0 top-0 h-full w-1.5 bg-green-500"></div>
                                )}

                                <ChapterBadge
                                    isRead={isRead}
                                    order={chapter.order}
                                />
                                {/* Chapter header with title and lock status */}
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex-1">
                                        <p className="line-clamp-1 text-lg font-medium text-gray-800">
                                            {isRead ? (
                                                <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                                                    ✓
                                                </span>
                                            ) : isPaid && !isUnlocked ? (
                                                <LockIcon className="mr-2 inline-block h-4 w-4 text-amber-500" />
                                            ) : (
                                                <UnlockIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                            )}
                                            Chương {chapter.order}:{' '}
                                            {chapter.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Chapter details row with update date */}
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="flex items-center text-sm text-gray-500">
                                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                                        Cập nhật:{' '}
                                        {new Date(
                                            chapter.updated_at,
                                        ).toLocaleDateString('vi-VN')}
                                    </p>

                                    {/* Pricing and preview button */}
                                    {isPaid && !isUnlocked && (
                                        <div className="flex items-center gap-3">
                                            <span className="flex-shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                {chapter.pricing}đ
                                            </span>

                                            {/* Preview button */}
                                            {isOngoing && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePreviewChapter(
                                                            chapter,
                                                        );
                                                    }}
                                                    className="flex flex-shrink-0 items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-200"
                                                >
                                                    <EyeIcon className="mr-1.5 h-3 w-3" />
                                                    Đọc thử
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Stats row */}
                                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="h-4 w-4 text-indigo-500" />
                                        {chapter.read_count.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MessagesSquare className="h-4 w-4 text-indigo-500" />
                                        {chapter.comments_count.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {comic.chapters.length > 4 && (
                    <button className="w-full py-4 text-center font-bold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-800">
                        Xem tất cả {comic.chapters.length} chương
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChaptersList;
