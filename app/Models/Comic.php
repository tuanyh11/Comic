<?php

namespace App\Models;

use App\Traits\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comic extends Model
{
    use HasMedia;
    protected $fillable = [
        'title',
        'slug',
        'description',
        'status_id',
        'author_id',
    ];


    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function author()
    {
        return $this->belongsTo(related: Author::class);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function thumbnail()
    {
        return $this->belongsTo(Media::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'comic_tags');
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'comic_genres');
    }

    public function readHistories()
    {
        return $this->hasMany(ReadHistory::class);
    }

    public function scopeWithChapterStats($query)
    {
        return $query->withSum('chapters', 'read_count')
            ->withSum('chapters', 'vote_count');
    }

    protected $appends = ['thumbnail'];

    public function getThumbnailAttribute(): ?Model
    {
        $mediaItem = $this->media()
            ->with('media') // Eager load chỉ cho truy vấn này
            ->orderBy('order')
            ->first();

        if ($mediaItem && $mediaItem->media) {
            return $mediaItem->media;
        }

        return null;
    }

    public function scopeWithThumbnail($query)
    {
        return $query->with(['media' => function ($query) {
            $query->with('media')
                ->orderBy('order')
                ->take(1);
        }]);
    }

    protected $with = ['media.media'];
}
