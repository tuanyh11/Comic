<?php

namespace App\Http\Controllers;

use App\Events\CommentEvent;
use App\Models\Comment;
use App\Models\User;
use App\Notifications\CommentReplyNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */

    public function index($chapter_id)
    {
        $comments = Comment::where('chapter_id', $chapter_id)
            ->select('id', 'content', 'user_id', 'chapter_id', 'created_at', 'parent_id') // Chọn các trường cần thiết từ comments
            ->with(['user' => function ($query) {
                $query->select('id', 'avatar', 'name'); // Chọn các trường từ users
            }])->get();
        
        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'chapter_id' => 'required|exists:chapters,id',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // First, get the chapter's comic_id
        $comicId = \App\Models\Chapter::find($validated['chapter_id'])->comic_id;

        $comment = Comment::create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'chapter_id' => $validated['chapter_id'],
            'parent_id' => $validated['parent_id'],
            'comic_id' => $comicId
        ]);

        // Load the user relationship
        $comment->load('user');

        // If this is a reply to another comment
        if ($comment->parent_id) {
            // Get the original comment's user
            $parentComment = Comment::find($comment->parent_id);
            
            if ($parentComment) {
                $originalUser = User::find($parentComment->user_id);
                
                // Don't notify if user is replying to their own comment
                if (Auth::id() !== $originalUser->id) {
                    // Send notification to the original commenter
                    // IMPORTANT: Remove the notification from CommentEvent as it's already being sent here
                    $originalUser->notify(new CommentReplyNotification($comment));
                    
                    // Just broadcast the event for real-time updates
                    event(new CommentEvent($comment, 'reply'));
                }
            }
        } else {
            // Broadcast new comment event to chapter channel
            event(new CommentEvent($comment, 'new'));
        }

        return back()->with('success', 'Comment posted successfully');
    }

    /**
     * Get comments for a chapter.
     */
    public function getChapterComments($chapterId)
    {
        $comments = Comment::where('chapter_id', $chapterId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }
}