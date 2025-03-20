import { Comic } from '@/types/custom';
import React, { useEffect, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ComicCarouselProps {
    comicList: Comic[];
    initialComic: Comic;
    onComicSelect: (comic: Comic) => void;
}

const ComicCarousel: React.FC<ComicCarouselProps> = ({
    comicList,
    initialComic,
    onComicSelect,
}) => {
    const [selectedComicId, setSelectedComicId] = useState<number | null>(
        initialComic.id,
    );
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
        null,
    );

    // Set initial active slide index
    const initialSlideIndex = comicList.findIndex(
        (comic) => comic.id === initialComic.id,
    );

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
        onComicSelect(comic);

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
            onComicSelect(comic);
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
        <div className="relative z-10 bg-gradient-to-t from-black/80 to-transparent pb-8 pt-[5vh]">
            <Swiper
                spaceBetween={20}
                slidesPerView="auto"
                initialSlide={initialSlideIndex >= 0 ? initialSlideIndex : 0}
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
                // autoplay={{
                //     delay: 5000,
                //     disableOnInteraction: false,
                // }}
            >
                {comicList.map((comic, index) => (
                    <SwiperSlide key={comic.id}>
                        <div
                            className={`w-full transform cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ${
                                selectedComicId === comic.id
                                    ? 'opacity-100 shadow-lg shadow-blue-500/30'
                                    : 'scale-90 opacity-70'
                            }`}
                            onClick={(e) => handleComicClick(comic, index, e)}
                        >
                            <div className="relative h-60 bg-gradient-to-br from-blue-900 to-pink-900 shadow-lg">
                                {comic?.media?.length > 0 && (
                                    <img
                                        src={comic.media[0].media.url}
                                        alt={
                                            comic.media[0].media.alt ||
                                            comic.title
                                        }
                                        className={`${
                                            selectedComicId === comic.id
                                                ? 'scale-105 brightness-110'
                                                : 'brightness-75'
                                        } h-full w-full object-cover transition-all duration-500`}
                                    />
                                )}
                            </div>

                            {/* Add a transparent overlay to improve click target area */}
                            <div className="absolute inset-0 z-10"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ComicCarousel;
