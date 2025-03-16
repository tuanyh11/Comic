<?php

namespace Plugins\MediaManager\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Plugins\MediaManager\MediaManager;
use Plugins\MediaManager\Http\Resources\MediaResource;

class MediaController extends Controller
{
    protected $mediaManager;

    public function __construct(MediaManager $mediaManager)
    {
        $this->mediaManager = $mediaManager;
    }

    /**
     * Lấy danh sách media.
     */
    public function index(Request $request)
    {
        $query = Media::query();
        
        // Lọc theo mime_type
        if ($request->has('mime_type')) {
            $mimeType = $request->input('mime_type');
            $query->where('mime_type', 'like', $mimeType . '%');
        }
        
        // Sắp xếp
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Phân trang
        $perPage = $request->input('per_page', 24);
        $media = $query->paginate($perPage);
        
        return MediaResource::collection($media);
    }

    /**
     * Upload file mới.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:' . (config('media-manager.max_file_size') / 1024),
        ]);
        
        $file = $request->file('file');
        $media = $this->mediaManager->upload($file);
        
        return new MediaResource($media);
    }

    /**
     * Xóa media.
     */
    public function destroy(Media $media)
    {
        $this->mediaManager->delete($media);
        
        return response()->json(['success' => true]);
    }
}