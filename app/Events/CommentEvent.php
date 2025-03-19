<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comment;
    public $action; // 'new', 'reply'

    /**
     * Create a new event instance.
     */
    public function __construct(Comment $comment, string $action = 'new')
    {
        $this->comment = $comment;
        $this->action = $action;
        
        // Remove the notification logic from here as it's now in the controller
        // This avoids sending duplicate notifications
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        if ($this->action === 'reply' && $this->comment->parent_id) {
            // Broadcast to the user who made the original comment
            $originalComment = Comment::find($this->comment->parent_id);
            
            if ($originalComment) {
                $originalCommentUserId = $originalComment->user_id;
                return [
                    new PrivateChannel('user.' . $originalCommentUserId),
                ];
            }
        }
        
        // For new main comments, broadcast to the channel for that chapter
        return [
            new PrivateChannel('chapter.' . $this->comment->chapter_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'comment.activity';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        // Load user with media relationship instead of avatar
        $this->comment->load(['user.media', 'parent.user.media']);
        
        return [
            'comment' => $this->comment,
            'action' => $this->action,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}