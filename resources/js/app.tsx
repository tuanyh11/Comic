import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();
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
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                    <ToastContainer />
                </QueryClientProvider>,
            );
            return;
        }

        createRoot(el).render(
            <>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                    <ToastContainer />
                </QueryClientProvider>
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
