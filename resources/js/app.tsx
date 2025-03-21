import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { FC, PropsWithChildren, useEffect } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
const appName = import.meta.env.VITE_APP_NAME || 'Comic';
const queryClient = new QueryClient();

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        document.documentElement.style.setProperty(
            '--scroll-padding-top',
            `${document.getElementById('header')?.offsetHeight}px`,
        );
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer />
        </QueryClientProvider>
    );
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <AppProvider>
                    <App {...props} />
                </AppProvider>,
            );
            return;
        }

        createRoot(el).render(
            <>
                <AppProvider>
                    <App {...props} />
                </AppProvider>
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
