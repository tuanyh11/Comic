import { Comic } from '@/types/custom';
import { Eye, Heart } from 'lucide-react';
import React from 'react';

interface ComicStatsProps {
    comic: Comic;
}

const ComicStats: React.FC<ComicStatsProps> = ({ comic }) => {
    return (
        <div className="mb-4 mt-4 flex flex-wrap items-center gap-3 text-sm">
            {/* Read Count */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                <Eye className="h-4 w-4 text-blue-300" />
                <span>{comic.read_count?.toLocaleString() || 0}</span>
            </div>

            {/* Vote Count */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                <Heart className="h-4 w-4 text-pink-400" />
                <span>{comic.vote_count?.toLocaleString() || 0}</span>
            </div>

            {comic.author && (
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                    <span>Tác giả: {comic.author.name}</span>
                </div>
            )}
        </div>
    );
};

export default ComicStats;
