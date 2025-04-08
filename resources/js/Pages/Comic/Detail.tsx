import RecommendedComics from '@/Components/UI/RecommendedComics';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Chapter, Comic } from '@/types/custom';
import { router } from '@inertiajs/react';
import { FC, useState } from 'react';

// Import the components
import AuthorInfo from './Partials/AuthorInfo';
import Breadcrumbs from './Partials/Breadcrumbs';
import ChapterPreviewModal from './Partials/ChapterPreviewModal';
import ChaptersList from './Partials/ChaptersList';
import ComicCover from './Partials/ComicCover';
import ComicDescription from './Partials/ComicDescription';
import ComicHeader from './Partials/ComicHeader';
import ComicTags from './Partials/ComicTags';
import InsufficientFundsModal from './Partials/InsufficientFundsModal';
import PurchaseConfirmationModal from './Partials/PurchaseConfirmationModal';

const Detail: FC<{ comic: Comic; walletBalance?: number }> = ({
    comic,
    walletBalance = 0,
}) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Modal states
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showFundsModal, setShowFundsModal] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(
        null,
    );

    const toggleFollow = () => setIsFollowing(!isFollowing);
    const toggleBookmark = () => setIsBookmarked(!isBookmarked);

    // Xử lý click vào chapter cần mở khóa
    const handleChapterClick = async (chapter: Chapter) => {
        // Nếu chapter miễn phí hoặc đã mở khóa, điều hướng trực tiếp đến chapter
        if (!chapter.pricing || chapter.is_unlocked) {
            // router.visit(`/comic/${comic.slug}/chapter/${chapter.id}`);
            const url = `/comic/${comic.slug}/chapter/${chapter.id}`;
            window.open(url, '_blank');
            return;
        }

        // Lưu lại chapter được chọn để sử dụng trong modal
        setSelectedChapter(chapter);

        // Nếu có đủ tiền trong ví, hiện modal xác nhận mua chapter
        if (walletBalance >= chapter.pricing) {
            setShowPurchaseModal(true);
        } else {
            // Nếu không đủ tiền, hiện modal chuyển đến trang nạp tiền
            setShowFundsModal(true);
        }
    };

    // Xử lý đọc thử chapter
    const handlePreviewChapter = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        document.getElementById('my_modal_3')?.showModal();
    };

    // Xử lý mua chapter
    const handlePurchaseConfirm = () => {
        if (selectedChapter) {
            router.post(
                route('chapter.purchase-with-wallet', {
                    slug: comic.slug,
                    chapter_id: selectedChapter.id,
                }),
            );
        }
        setShowPurchaseModal(false);
    };

    // Xử lý nạp tiền
    const handleAddFundsConfirm = () => {
        router.visit('/wallet/add-funds');
        setShowFundsModal(false);
    };

    const readCount = comic.chapters.reduce((a, b) => a + b.read_count, 0);
    const voteCount = comic.chapters.reduce((a, b) => a + b.vote_count, 0);
    const commentCount = comic.chapters.reduce(
        (a, b) => a + b.comments_count,
        0,
    );

    // Lấy danh sách tag_ids
    const tagIds = comic.tags.map((tag) => tag.id);

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 font-sans">
                {/* Modals */}
                <PurchaseConfirmationModal
                    showPurchaseModal={showPurchaseModal}
                    selectedChapter={selectedChapter}
                    onConfirm={handlePurchaseConfirm}
                    onCancel={() => setShowPurchaseModal(false)}
                />

                <ChapterPreviewModal selectedChapter={selectedChapter} />

                <InsufficientFundsModal
                    showFundsModal={showFundsModal}
                    onConfirm={handleAddFundsConfirm}
                    onCancel={() => setShowFundsModal(false)}
                />

                {/* Main Content */}
                <main className="mx-auto max-w-6xl p-4">
                    {/* Story Header */}
                    <Breadcrumbs comic={comic} />
                    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">
                        {/* Book Cover */}
                        <ComicCover
                            comic={comic}
                            isBookmarked={isBookmarked}
                            toggleBookmark={toggleBookmark}
                            voteCount={voteCount}
                            readCount={readCount}
                            chaptersCount={comic.chapters.length}
                            commentCount={commentCount}
                        />

                        {/* Story Details */}
                        <div className="p-8 md:w-2/3">
                            {/* Comic Title */}
                            <ComicHeader title={comic.title} />

                            {/* Author Info */}
                            <AuthorInfo
                                comic={comic}
                                isFollowing={isFollowing}
                                toggleFollow={toggleFollow}
                            />
                            {/* Tags */}
                            <ComicTags tags={comic.tags} />

                            {/* Description */}
                            <ComicDescription description={comic.description} />

                            {/* Wallet Balance */}
                            {/* <WalletBalance balance={walletBalance} /> */}

                            {/* Table of Contents */}
                            <ChaptersList
                                comic={comic}
                                handleChapterClick={handleChapterClick}
                                handlePreviewChapter={handlePreviewChapter}
                            />
                        </div>
                    </div>

                    {/* Recommended Stories */}
                    <div className="mb-12 mt-12">
                        <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-800">
                            <span className="inline-block h-1.5 w-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"></span>
                            Có thể bạn cũng thích
                        </h2>
                        <RecommendedComics
                            currentComicId={comic.id}
                            tagIds={tagIds}
                        />
                    </div>
                </main>
            </div>
        </DefaultLayout>
    );
};

export default Detail;
