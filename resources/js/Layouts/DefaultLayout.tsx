import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import React, { PropsWithChildren } from 'react';
import Authenticated from './AuthenticatedLayout';

const DefaultLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Authenticated header={<Header />} footer={<Footer />}>
                {children}
            </Authenticated>
        </>
    );
};

export default DefaultLayout;
