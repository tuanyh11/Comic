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
    avatar: Media;
};

export type Genre = {
    id: number;
    name: string;
    slug: string;
    media: Media;
};

export type Comic = {
    id: number;
    title: string;
    slug: string;
    status: 'completed' | 'ongoing' | 'cancelled';
    author: User;
    thumbnail: Media;
    created_at: string;
    updated_at: string;
    tags: Tag[];
    chapters: Chapter[];
    description: string;
};

export type Chapter = {
    id: number;
    title: string;
    order: number;
    media: Media;
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
};

export type Comment = {
    content: string;
    id: number;
    parent_id: number | null;
    user: Omit<User, 'email' | 'email_verified_at'>;
    created_at: string;
};

export type Tag = {
    id: number;
    name: string;
};

interface Media {
    url: string;
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

// export interface Notification {
//     id: string;
//     type: string;
//     read_at: string | null;
//     data: any;
//     created_at: string;
// }
