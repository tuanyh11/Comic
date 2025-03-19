import DefaultLayout from '@/Layouts/DefaultLayout';
import { Chapter, Comic, Genre, LaravelPagination } from '@/types/custom';
import formatCount from '@/utils/formatCount';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Heart,
    Star,
    TrendingUp,
} from 'lucide-react';
import { FC, useState } from 'react';

const Home: FC<{
    comics: LaravelPagination<
        Comic & Pick<Chapter, 'read_count' | 'vote_count'>
    >;
    genres: Genre[];
}> = ({ comics, genres }) => {
    const [activeTab, setActiveTab] = useState('for-you');
    const comicData = comics?.data;
    const genreData = genres;
    console.log('====================================');
    console.log(comics.data);
    console.log('====================================');
    return (
        <DefaultLayout>
            <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50">
                {/* Hero Section - Improved with background image */}
                <div className="relative mb-8 overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/storage/media/ce038394-d8d7-4d00-9438-0cdbab7c8aa4.jpeg"
                            alt="Hero Background"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-pink-900/80"></div>
                    </div>

                    {/* Content */}
                    <div className="container relative z-10 mx-auto px-4 py-16">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="max-w-xl text-white">
                                <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                                    Khám phá những câu chuyện tuyệt vời
                                </h1>
                                <p className="mb-6 text-lg opacity-90">
                                    Hàng ngàn câu chuyện thú vị đang chờ đón bạn
                                    - đọc, chia sẻ và kết nối với cộng đồng yêu
                                    thích truyện.
                                </p>
                                <div className="flex gap-4">
                                    <Link
                                        href="#featured"
                                        className="rounded-full bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-blue-300/50"
                                    >
                                        Khám phá ngay
                                    </Link>
                                    <Link
                                        href="/genres"
                                        className="rounded-full border border-white bg-transparent px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10"
                                    >
                                        Xem thể loại
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Tabs */}
                    <div className="mb-8 flex border-b">
                        <button
                            onClick={() => setActiveTab('for-you')}
                            className={`flex items-center space-x-2 px-4 py-2 ${
                                activeTab === 'for-you'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            <Star className="h-5 w-5" />
                            <span>Dành cho bạn</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('trending')}
                            className={`flex items-center space-x-2 px-4 py-2 ${
                                activeTab === 'trending'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            <TrendingUp className="h-5 w-5" />
                            <span>Xu hướng</span>
                        </button>
                    </div>

                    {/* Genres Quick Filter */}
                    <div className="mb-8 flex space-x-4 overflow-x-auto py-2">
                        {genreData.map((genre) => (
                            <button
                                key={genre.id}
                                className="rounded-full border bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>

                    {/* Stories Grid */}
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {comicData.map((story) => (
                            <Link
                                href={`/comic/${story.id}`}
                                key={story.id}
                                className="overflow-hidden rounded-xl bg-white pt-4 shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
                            >
                                <div className="book-container py-4">
                                    <div className="book">
                                        <img
                                            src={story.thumbnail.url}
                                            alt={story.title}
                                            className="h-56 w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="mb-2 truncate text-lg font-bold text-gray-800">
                                        {story.title}
                                    </h3>
                                    <p className="mb-3 text-sm text-gray-600">
                                        {story.author.name}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex space-x-3">
                                            {story.status === 'ongoing' && (
                                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                                    {story.status}
                                                </span>
                                            )}
                                            <span className="flex items-center">
                                                <Heart className="mr-1 h-4 w-4 text-pink-500" />{' '}
                                                {formatCount(story.vote_count)}
                                            </span>
                                            <span className="flex items-center">
                                                <BookOpen className="mr-1 h-4 w-4 text-blue-500" />{' '}
                                                {formatCount(story.read_count)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <Link
                                href={
                                    comics.prev_page_url
                                        ? comics.prev_page_url.replace(
                                              '/',
                                              '/comic',
                                          )
                                        : '#'
                                }
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    comics.prev_page_url
                                        ? 'bg-white text-blue-600 shadow hover:bg-blue-50'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                }`}
                                preserveScroll
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Link>

                            {[...Array(comics.last_page)].map((_, index) => (
                                <Link
                                    key={index}
                                    href={`/comic?page=${index + 1}`}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                        comics.current_page === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-blue-600 shadow hover:bg-blue-50'
                                    }`}
                                    preserveScroll
                                >
                                    {index + 1}
                                </Link>
                            ))}

                            <Link
                                href={comics.next_page_url || '#'}
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    comics.next_page_url
                                        ? 'bg-white text-blue-600 shadow hover:bg-blue-50'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                }`}
                                preserveScroll
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </DefaultLayout>
    );
};

export default Home;
