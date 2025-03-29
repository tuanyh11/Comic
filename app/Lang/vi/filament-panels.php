<?php

return [
    'navigation' => [
        'groups' => [
            'User Management' => 'Quản lý người dùng',
            'Content Management' => 'Quản lý nội dung',
            'Financial Management' => 'Quản lý tài chính',
            'Taxonomy' => 'Phân loại',
        ],
    ],
    
    'resources' => [
        // Đổi tên các resources trong sidebar
        'ComicResource' => [
            'label' => 'Truyện',
            'plural_label' => 'Truyện',
        ],
        'AuthorResource' => [
            'label' => 'Tác giả',
            'plural_label' => 'Tác giả',
        ],
        'ChapterResource' => [
            'label' => 'Chương',
            'plural_label' => 'Chương',
        ],
        'CommentResource' => [
            'label' => 'Bình luận',
            'plural_label' => 'Bình luận',
        ],
        'UserResource' => [
            'label' => 'Người dùng',
            'plural_label' => 'Người dùng',
        ],
        'WalletResource' => [
            'label' => 'Ví',
            'plural_label' => 'Ví',
        ],
        'WalletTransactionResource' => [
            'label' => 'Giao dịch ví',
            'plural_label' => 'Giao dịch ví',
        ],
        'PaymentResource' => [
            'label' => 'Thanh toán',
            'plural_label' => 'Thanh toán',
        ],
        'PurchasedChapterResource' => [
            'label' => 'Chương đã mua',
            'plural_label' => 'Chương đã mua',
        ],
        'GenreResource' => [
            'label' => 'Thể loại',
            'plural_label' => 'Thể loại',
        ],
        'TagResource' => [
            'label' => 'Tag',
            'plural_label' => 'Tags',
        ],
        'StatusResource' => [
            'label' => 'Trạng thái',
            'plural_label' => 'Trạng thái',
        ],
        'TermResource' => [
            'label' => 'Điều khoản',
            'plural_label' => 'Điều khoản',
        ],
    ],
    
    'pages' => [
        'dashboard' => [
            'title' => 'Bảng điều khiển',
        ],
    ],
];