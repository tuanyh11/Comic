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
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all notifications, with the newest first
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        
        // Count unread notifications
        $unreadCount = $user->unreadNotifications()->count();
        
        info('Notifications retrieved', ['user_id' => $user->id, 'unread_count' => $unreadCount]);
        if (request()->wantsJson()) {
            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]);
        }
        
        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }
    
    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->where('id', $id)->first();
        
        if ($notification) {
            $notification->markAsRead();
            
            if (request()->wantsJson()) {
                return response()->json(['success' => true]);
            }
            
            return redirect()->back()->with('success', 'Notification marked as read');
        }
        
        if (request()->wantsJson()) {
            return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
        }
        
        return redirect()->back()->with('error', 'Notification not found');
    }
    
    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();
        
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        
        return redirect()->back()->with('success', 'All notifications marked as read');
    }
}