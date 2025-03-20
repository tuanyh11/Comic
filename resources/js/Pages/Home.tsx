// @/Pages/Home.tsx
import ComicGrid from '@/Components/Home/ComicGrid';
import GenreFilter from '@/Components/Home/GenreFilter';
import HeroSection from '@/Components/Home/HeroSection';
import Pagination from '@/Components/Home/Pagination';
import TabsSection from '@/Components/Home/TabsSection';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Chapter, Comic, Genre, LaravelPagination } from '@/types/custom';
import { FC, useState } from 'react';

const Home: FC<{
    comics: LaravelPagination<
        Comic & Pick<Chapter, 'read_count' | 'vote_count'>
    >;
    genres: Genre[];
}> = ({ comics, genres }) => {
    const [activeTab, setActiveTab] = useState('for-you');
    const comicData = comics?.data;

    return (
        <DefaultLayout>
            <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50">
                <HeroSection />

                <div className="container mx-auto px-4 py-8">
                    <TabsSection
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <GenreFilter genres={genres} />

                    <ComicGrid comics={comicData} />

                    <Pagination pagination={comics} />
                </div>
            </main>
        </DefaultLayout>
    );
};

export default Home;
