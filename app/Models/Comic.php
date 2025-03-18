<?php

namespace App\Models;

use App\Traits\HasMedia;
use Illuminate\Database\Eloquent\Model;

class Comic extends Model
{
    use HasMedia;
    protected $fillable = [
        'title',
        'slug',
        'description',
        'status',
        'author_id',
    ];

    public function author()
    {
        return $this->belongsTo(User::class);
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
}
