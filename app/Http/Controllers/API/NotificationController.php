<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get user notifications
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Base query for notifications
        $query = $user->notifications()->orderBy('created_at', 'desc');
        
        // Apply limit if requested (for preview mode)
        if ($request->has('limit') && !$request->has('all')) {
            $limit = (int) $request->input('limit', 5);
            $query->limit($limit);
        }
        
        // Get notifications
        $notifications = $query->get();
        
        // Count unread notifications (always get total regardless of limit)
        $unreadCount = $user->unreadNotifications()->count();
        
        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }
    
    /**
     * Mark a notification as read
     * 
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $notification = $user->notifications()->where('id', $id)->first();
        
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['success' => true, 'data' => $notification]);
        }
        
        return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
    }
    
    /**
     * Mark all notifications as read
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $user->unreadNotifications->markAsRead();
        
        return redirect()->back();
    }
}