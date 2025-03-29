export interface LaravelPagination<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type ReplyPaginationsMap = Record<number, LaravelPagination<Comment>>;

// Define a specialized type for grouped comments
export interface GroupedComment {
    comment: Comment;
    replies: Comment[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    media: {
        media: Media;
    }[];
    avatar?: string;
};

export type Genre = {
    id: number;
    name: string;
    slug: string;
    media: Media;
};

export type ComicStatus = {
    name: string;
    id: number;
    slug: string;
    description: string;
    color: string;
    is_default: boolean;
};

export type Comic = {
    id: number;
    title: string;
    slug: string;
    status: ComicStatus;
    author: User;
    media: {
        media: Media;
    }[];
    created_at: string;
    updated_at: string;
    tags: Tag[];
    chapters: Chapter[];
    description: string;
    read_count: number;
    vote_count: number;
    genres: Genre[];
    thumbnail: Media;
};

export type Chapter = {
    id: number;
    title: string;
    order: number;
    media: { media: Media }[];
    description: string;
    read_count: number;
    vote_count: number;
    comments_count: number;
    updated_at: string;
    comments: LaravelPagination<Comment>;
    has_voted: boolean;
    is_paid_content?: boolean;
    is_unlocked?: boolean;
    pricing: number;
    is_read: boolean;
};

export type Comment = {
    content: string;
    id: number;
    parent_id: number | null;
    user: Omit<User, 'email' | 'email_verified_at'>;
    created_at: string;
    comic_id?: string;
    chapter_id: string;
};

export type Tag = {
    id: number;
    name: string;
};

interface Media {
    url: string;
    large_url: string;
    medium_ur: string;
    alt?: string;
}

export interface Transaction {
    id: number;
    amount: string;
    balance_after: string;
    balance_before: string;
    created_at: string;
    description: string;
    status: string;
    transaction_id: string;
    type: TransactionType;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'purchase';

// Add this to resources/js/types/custom.ts

export type Notification<T> = {
    id: string;
    type: string;
    read_at: string | null;
    data: {
        action: string;
        timestamp?: string;
        comment: T;
    };
    created_at: string;
};
