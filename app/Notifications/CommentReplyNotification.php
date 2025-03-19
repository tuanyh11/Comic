<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;

class CommentReplyNotification extends Notification implements ShouldQueue, ShouldBroadcast
{
    use Queueable;

    public $comment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Phản hồi mới cho bình luận của bạn')
            ->line("{$this->comment->user->name} đã trả lời bình luận của bạn.")
            ->line("Nội dung: {$this->comment->content}")
            ->action('Xem bình luận', url("/comic/{$this->comment->comic_id}/chapter/{$this->comment->chapter_id}"))
            ->line('Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // Make sure to load relationships
        $this->comment->load(['user', 'parent.user']);
        
        return [
            'comment' => $this->comment,
            'action' => 'reply',
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'comment' => $this->comment->load(['user', 'parent.user']),
            'action' => 'reply',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}