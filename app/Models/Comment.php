<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'content',
        'user_id',
        'chapter_id',
        'comic_id',
        'parent_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function comic()
    {
        return $this->belongsTo(Comic::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

     public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function getRepliesCountAttribute()
    {
        // If the replies_count was already loaded via withCount()
        if (array_key_exists('replies_count', $this->attributes)) {
            return $this->attributes['replies_count'];
        }

        // Otherwise, calculate it
        return $this->replies()->count();
    }
}
