import { Config } from 'ziggy-js';
import { User } from './custom';

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    wallet: {
        balance: string;

        currency: string;
    };
};
