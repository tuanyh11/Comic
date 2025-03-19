import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
    footer,
}: PropsWithChildren<{ header?: ReactNode; footer?: ReactNode }>) {
    const user = usePage().props.auth.user;
    return (
        <>
            {header && header}

            <main>{children}</main>

            {footer && footer}
        </>
    );
}
