import { Head, Link } from '@inertiajs/react';
import { BookOpen, Eye, Heart, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Comic {
    id: number;
    title: string;
    description: string;
    rating: string;
    votes: string;
    year: string;
    genre: string;
    read_count: number;
    vote_count?: number;
    image?: string;
    thumbnail?: {
        url: string;
        alt: string;
    };
    genres?: Array<{
        id: number;
        name: string;
    }>;
    tags?: Array<{
        id: number;
        name: string;
    }>;
    author?: {
        id: number;
        name: string;
        avatar?: string;
    };
    chapters?: number;
}

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
    featuredComic: Comic;
    comicList: Comic[];
}

export default function Welcome({ featuredComic, comicList }: Props) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [currentComic, setCurrentComic] = useState<Comic>(featuredComic);
    const [selectedComicId, setSelectedComicId] = useState<number | null>(
        featuredComic.id,
    );
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
        null,
    );

    // Set initial active slide index
    const initialSlideIndex = comicList.findIndex(
        (comic) => comic.id === featuredComic.id,
    );

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleComicClick = (
        comic: Comic,
        index: number,
        event: React.MouseEvent,
    ) => {
        // Stop event propagation to prevent any other click handlers
        event.stopPropagation();

        // If clicking on already selected comic, do nothing
        if (selectedComicId === comic.id) return;

        setSelectedComicId(comic.id);

        // Update the featured comic display
        setCurrentComic(comic);

        // Reset description state
        setShowFullDescription(false);

        // Slide to the clicked comic with a slight delay to ensure proper slide operation
        if (swiperInstance) {
            swiperInstance.slideTo(index + 1);
        }
    };

    // Handle slide change from Swiper
    const handleSlideChange = (swiper: SwiperType) => {
        const realIndex = swiper.realIndex; // Get the real index accounting for looping
        const comic = comicList[realIndex];

        if (comic && comic.id !== selectedComicId) {
            setSelectedComicId(comic.id);
            setCurrentComic(comic);
            setShowFullDescription(false);
        }
    };

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!swiperInstance) return;

            if (e.key === 'ArrowLeft') {
                swiperInstance.slidePrev();
            } else if (e.key === 'ArrowRight') {
                swiperInstance.slideNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [swiperInstance]);

    return (
        <>
            <Head title="Comic Collection" />
            <div className="relative min-h-screen text-white">
                {/* Main Comic Showcase */}
                <div className="relative h-full">
                    {/* Background Image with fade transition */}
                    <div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700">
                        {currentComic.thumbnail ? (
                            <div className="relative h-full w-full">
                                <img
                                    src={currentComic.thumbnail.url}
                                    alt={currentComic.thumbnail.alt}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-pink-900/40 mix-blend-multiply"></div>
                            </div>
                        ) : (
                            <div className="h-full w-full bg-gradient-to-r from-blue-900 to-pink-900"></div>
                        )}
                    </div>

                    {/* Overlay Gradient */}
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-blue-900/90 via-black/70 to-transparent"></div>

                    {/* Top Navigation Bar */}
                    <div className="sticky left-0 right-0 top-0 z-30">
                        <div className="container mx-auto flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <h2 className="text-xl font-bold text-white">
                                    Wattpad
                                </h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Show login/register buttons if user is not logged in */}
                                <Link
                                    href="/login"
                                    className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-pink-600"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Comic Information */}
                    <div className="relative z-20 flex max-w-4xl flex-col justify-center px-8 pt-20 pt-[10vh] md:px-12 lg:px-16">
                        <h1 className="mb-2 text-4xl font-bold text-white transition-all duration-500 md:text-6xl">
                            {currentComic.title}
                        </h1>

                        <div className="mb-4 mt-4 flex flex-wrap items-center gap-3 text-sm">
                            {currentComic.rating && (
                                <>
                                    <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                                        <span className="font-bold text-yellow-400">
                                            ★
                                        </span>
                                        <span className="font-bold">
                                            {currentComic.rating}
                                        </span>
                                        <span className="text-gray-300">
                                            ({currentComic.votes})
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* Read Count */}
                            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                                <Eye className="h-4 w-4 text-blue-300" />
                                <span>
                                    {currentComic.read_count?.toLocaleString() ||
                                        0}
                                </span>
                            </div>

                            {/* Vote Count */}
                            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                                <Heart className="h-4 w-4 text-pink-400" />
                                <span>
                                    {currentComic.vote_count?.toLocaleString() ||
                                        0}
                                </span>
                            </div>

                            {currentComic.year && (
                                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                                    <span>{currentComic.year}</span>
                                </div>
                            )}

                            {currentComic.author && (
                                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                                    <span>
                                        Tác giả: {currentComic.author.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {currentComic.genres &&
                            currentComic.genres.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm text-gray-300">
                                            Thể loại:
                                        </span>
                                        {currentComic.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-200 backdrop-blur-sm"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Tags */}
                        {currentComic.tags && currentComic.tags.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {currentComic.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full border border-pink-400/30 bg-pink-500/20 px-3 py-1 text-xs text-pink-200 backdrop-blur-sm"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div
                            dangerouslySetInnerHTML={{
                                __html: currentComic.description,
                            }}
                            className={`mb-8 max-w-3xl rounded-lg border border-white/10 bg-white/5 p-4 text-white/80 backdrop-blur-sm transition-all duration-300 ${
                                !showFullDescription && 'line-clamp-3'
                            }`}
                        ></div>

                        {currentComic.description &&
                            currentComic.description.length > 150 && (
                                <button
                                    onClick={toggleDescription}
                                    className="mb-6 flex items-center text-sm text-blue-300 transition-colors hover:text-blue-200"
                                >
                                    {showFullDescription
                                        ? 'Ẩn bớt'
                                        : 'Xem thêm'}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className={`ml-1 h-4 w-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            )}

                        <div className="mb-12 flex flex-wrap gap-4">
                            <button className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/10">
                                <BookOpen className="h-5 w-5" />
                                Đọc thử
                            </button>
                            <Link
                                href="/home"
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 text-white shadow-lg transition-all hover:from-blue-600 hover:to-pink-600 hover:shadow-xl"
                            >
                                <Play className="h-5 w-5" />
                                Đọc ngay
                            </Link>
                        </div>
                    </div>
                    <div className="relative z-10 bg-gradient-to-t from-black/80 to-transparent pb-8 pt-[5vh]">
                        <Swiper
                            spaceBetween={20}
                            slidesPerView="auto"
                            initialSlide={
                                initialSlideIndex >= 0 ? initialSlideIndex : 0
                            }
                            modules={[Autoplay, Pagination]}
                            speed={1000}
                            loop={true}
                            breakpoints={{
                                640: { slidesPerView: 3, centeredSlides: true },
                                768: { slidesPerView: 5, centeredSlides: true },
                                1024: {
                                    slidesPerView: 7,
                                    centeredSlides: true,
                                },
                                1280: {
                                    slidesPerView: 7,
                                    centeredSlides: true,
                                },
                            }}
                            className="comics-swiper"
                            onSwiper={setSwiperInstance}
                            onSlideChange={handleSlideChange}
                            watchSlidesProgress={true}
                            slideToClickedSlide={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                        >
                            {comicList.map((comic, index) => (
                                <SwiperSlide key={comic.id}>
                                    <div
                                        className={`w-full transform cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ${
                                            selectedComicId === comic.id
                                                ? 'scale-110 opacity-100 shadow-lg shadow-blue-500/30'
                                                : 'scale-90 opacity-70'
                                        }`}
                                        onClick={(e) =>
                                            handleComicClick(comic, index, e)
                                        }
                                    >
                                        <div className="relative h-60 bg-gradient-to-br from-blue-900 to-pink-900 shadow-lg">
                                            {comic.thumbnail ? (
                                                <img
                                                    src={comic.thumbnail.url}
                                                    alt={
                                                        comic.thumbnail.alt ||
                                                        comic.title
                                                    }
                                                    className={`${
                                                        selectedComicId ===
                                                        comic.id
                                                            ? 'scale-105 brightness-110'
                                                            : 'brightness-75'
                                                    } h-full w-full object-cover transition-all duration-500`}
                                                />
                                            ) : comic.image ? (
                                                <img
                                                    src={comic.image}
                                                    alt={comic.title}
                                                    className={`${
                                                        selectedComicId ===
                                                        comic.id
                                                            ? 'scale-105 brightness-110'
                                                            : 'brightness-75'
                                                    } h-full w-full object-cover transition-all duration-500`}
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-800 to-pink-800 text-xs text-white/70 transition-colors duration-300 ${
                                                        selectedComicId ===
                                                        comic.id
                                                            ? 'from-blue-700 to-pink-700 text-white'
                                                            : ''
                                                    }`}
                                                >
                                                    {comic.title}
                                                </div>
                                            )}

                                            {/* Selected Indicator */}
                                            {selectedComicId === comic.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-pink-500"></div>
                                            )}
                                        </div>

                                        {/* Add a transparent overlay to improve click target area */}
                                        <div className="absolute inset-0 z-10"></div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* Comics Carousel */}
            </div>
        </>
    );
}
