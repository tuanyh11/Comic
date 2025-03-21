<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\User;
use App\Notifications\CommentReplyNotification;
use App\Events\CommentEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Get parent comments for a chapter with pagination
     */
    public function index($chapter_id)
    {
        $chapter = Chapter::findOrFail($chapter_id);

        // Get only parent comments (parent_id is null) with pagination
        $parentComments = $chapter->comments()
            ->whereNull('parent_id')
            ->with(['user' => function ($query) {
                $query->select('id', 'name')->with('media');
            }])
            ->withCount('replies')
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        if (request()->wantsJson()) {
            return response()->json($parentComments);
        }

        return Inertia::render('Comments/Index', [
            'comments' => $parentComments,
            'chapter' => $chapter->only(['id', 'title', 'comic_id']),
        ]);
    }

    /**
     * Get replies for a specific parent comment
     */
    public function getReplies($comment_id)
    {
        // Validate parent comment exists
        $parentComment = Comment::findOrFail($comment_id);

        // Get replies with pagination
        $replies = Comment::where('parent_id', $comment_id)
            ->with(['user' => function ($query) {
                $query->select('id', 'name')->with('media');
            }])
            ->orderBy('created_at', 'asc')
            ->paginate(3);

        if (request()->wantsJson()) {
            return response()->json($replies);
        }

        return Inertia::render('Comments/Replies', [
            'replies' => $replies,
            'parentComment' => $parentComment->load('user'),
        ]);
    }

    /**
     * Store a comment for a specific chapter
     */
    public function store(Request $request, $chapter_id)
    {
        $chapter = Chapter::findOrFail($chapter_id);

        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'chapter_id' => $chapter_id,
            'parent_id' => $validated['parent_id'] ?? null,
            'comic_id' => $chapter->comic_id
        ]);

        // Lấy user hiện tại với media đầy đủ
        $currentUser = User::select('id', 'name')
            ->with('media')
            ->find(Auth::id());

        // Gán user đã load đầy đủ media vào comment
        $comment->setRelation('user', $currentUser);
        
        // Xử lý events và notifications
        if ($comment->parent_id) {
            // Get the original comment's user
            $parentComment = Comment::find($comment->parent_id);
            $originalUser = User::find($parentComment->user_id);
            // Don't notify if user is replying to their own comment
            if (Auth::id() !== $originalUser->id) {
                // Send notification to the original commenter
                $originalUser->notify(new CommentReplyNotification($comment));
            }
            event(new CommentEvent($comment, 'reply'));
        } else {
            // Broadcast new comment event to chapter channel
            event(new CommentEvent($comment, 'new'));
        }

        // If this is a reply, include the parent's updated reply count
        if ($validated['parent_id']) {
            $parentComment = Comment::findOrFail($validated['parent_id']);
            $repliesCount = $parentComment->replies()->count();
            $comment->parent_replies_count = $repliesCount;
        }

        if (request()->wantsJson()) {
            return response()->json([
                'comment' => $comment,
                'message' => 'Comment posted successfully'
            ], 201);
        }

        return redirect()->back()->with('success', 'Comment posted successfully');
    }

    public function show($comment_id)
    {
        try {
            // Tìm comment với ID cụ thể và load quan hệ user kèm media
            $comment = Comment::with(['user' => function ($query) {
                $query->select('id', 'name')->with('media');
            }])
            ->findOrFail($comment_id);
            
            if (request()->wantsJson()) {
                return response()->json($comment);
            }
            
            return Inertia::render('Comments/Show', [
                'comment' => $comment,
                'chapter' => Chapter::find($comment->chapter_id)->only(['id', 'title', 'comic_id']),
            ]);
        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Comment not found',
                    'error' => $e->getMessage()
                ], 404);
            }
            
            return redirect()->back()->with('error', 'Comment not found');
        }
    }
}