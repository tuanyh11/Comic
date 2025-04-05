<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Services\PaymentService;
use App\Services\ReadingService;
use App\Services\ChapterAccessService;
use App\Services\VoteService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChapterController extends Controller
{
    protected PaymentService $paymentService;
    protected ReadingService $readingService;
    protected ChapterAccessService $chapterAccessService;
    protected VoteService $voteService;

    public function __construct(
        PaymentService $paymentService,
        ReadingService $readingService,
        ChapterAccessService $chapterAccessService,
        VoteService $voteService
    ) {
        $this->paymentService = $paymentService;
        $this->readingService = $readingService;
        $this->chapterAccessService = $chapterAccessService;
        $this->voteService = $voteService;
    }

    public function show($id, $chapter_id)
    {
        $chapter = Chapter::where('id', $chapter_id)
            ->with('media.media')
            ->with('comic')
            ->firstOrFail();

        $accessData = $this->chapterAccessService->getChapterAccessData($chapter);

        // Merge access data with chapter
        foreach ($accessData as $key => $value) {
            $chapter->$key = $value;
        }

        // Get next and previous chapters
        $nextChapter = $chapter->getNextChapter();
        $prevChapter = $chapter->getPreviousChapter();

        // Record reading if unlocked and authenticated
        if ($accessData['is_unlocked'] && Auth::check()) {
            $this->readingService->recordReading(Auth::user(), $chapter);
        }

        // Redirect to purchase page if content is paid and not unlocked
        if ($accessData['is_paid_content'] && !$accessData['is_unlocked']) {
            return Inertia::render('Comic/ChapterLocked', [
                "chapter" => $chapter,
                "nextChapter" => $nextChapter,
                "prevChapter" => $prevChapter,
                "walletBalance" => Auth::check() ? $this->paymentService->getWalletBalance(Auth::user()) : 0
            ]);
        }

        return Inertia::render('Comic/Chapter', [
            "chapter" => $chapter,
            "nextChapter" => $nextChapter,
            "prevChapter" => $prevChapter,
        ]);
    }

    public function showIframe($id, $chapter_id)
    {
        $chapter = Chapter::where('id', $chapter_id)
            ->with('media.media')
            ->firstOrFail();

        $accessData = $this->chapterAccessService->getChapterAccessData($chapter);

        // Merge access data with chapter
        foreach ($accessData as $key => $value) {
            $chapter->$key = $value;
        }

        // Increment read count if unlocked
        if ($accessData['is_unlocked']) {
            $chapter->increment('read_count');
        }

        // Redirect to purchase page if content is paid and not unlocked
        if ($accessData['is_paid_content'] && !$accessData['is_unlocked']) {
            return Inertia::render('Comic/ChapterLocked', [
                "chapter" => $chapter,
                "walletBalance" => Auth::check() ? $this->paymentService->getWalletBalance(Auth::user()) : 0
            ]);
        }

        return view('comic/chapter', [
            "chapter" => $chapter,
        ]);
    }

    public function preview($id, $chapter_id)
    {
        $chapter = Chapter::where('id', $chapter_id)
            ->with('media.media')
            ->firstOrFail();

        $accessData = $this->chapterAccessService->getChapterAccessData($chapter);

        // Merge access data with chapter
        foreach ($accessData as $key => $value) {
            $chapter->$key = $value;
        }

        // Increment read count if unlocked
        if ($accessData['is_unlocked']) {
            $chapter->increment('read_count');
        }

        // Redirect to purchase page if content is paid and not unlocked
        // if ($accessData['is_paid_content'] && !$accessData['is_unlocked']) {
        //     return Inertia::render('Comic/ChapterLocked', [
        //         "chapter" => $chapter,
        //         "walletBalance" => Auth::check() ? $this->paymentService->getWalletBalance(Auth::user()) : 0
        //     ]);
        // }

        return view('comic/chapterPreview', [
            "chapter" => $chapter,
        ]);
    }

    /**
     * Handle voting for a chapter
     */
    public function vote($slug, $chapter_id)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để vote'
            ], 401);
        }

        $chapter = Chapter::findOrFail($chapter_id);
        $user = Auth::user();

        // Check if paid content is accessible
        if (!$this->chapterAccessService->canUserAccessChapter($user, $chapter)) {
            return response()->json([
                'message' => 'Bạn cần mở khóa chapter này trước khi vote'
            ], 403);
        }

        // Toggle vote and get result
        $voteResult = $this->voteService->toggleVote($user, $chapter);

        return response()->json($voteResult);
    }

    /**
     * Display purchase page
     */
    public function purchase(Chapter $chapter)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('message', 'Vui lòng đăng nhập để mua chapter');
        }

        // If user already purchased this chapter, redirect to chapter page
        if ($this->chapterAccessService->isChapterAccessibleBy(Auth::user(), $chapter)) {
            return redirect()->route('chapters.show', $chapter->id);
        }

        return Inertia::render('Comic/ChapterPurchase', [
            'chapter' => $chapter->load('comic'),
            'walletBalance' => $this->paymentService->getWalletBalance(Auth::user()),
        ]);
    }

    /**
     * Process purchase
     */
    public function processPurchase(Request $request, Chapter $chapter)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để mua chapter'
            ], 401);
        }

        $user = Auth::user();

        // Check if user already purchased this chapter
        if ($this->chapterAccessService->isChapterAccessibleBy($user, $chapter)) {
            return response()->json([
                'message' => 'Bạn đã mua chapter này rồi',
                'success' => true
            ]);
        }

        // TODO: Add payment processing logic here

        // Record purchase
        $chapter->purchasedBy()->create([
            'user_id' => $user->id,
            'price' => $chapter->pricing
        ]);

        return response()->json([
            'message' => 'Mua chapter thành công',
            'success' => true
        ]);
    }

    /**
     * Purchase with wallet
     */
    public function purchaseWithWallet($slug, $chapter_id)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $chapter = Chapter::findOrFail($chapter_id);
        $comic = $chapter->comic;

        // Check if chapter is paid content
        if (!$chapter->isPaidContent()) {
            return redirect()->back()->with('error', 'Chapter này là nội dung miễn phí');
        }

        // Check if user already purchased this chapter
        if ($this->chapterAccessService->isChapterAccessibleBy($user, $chapter)) {
            return redirect()->route('chapter.show', [
                'slug' => $comic->slug,
                'chapter_id' => $chapter->id
            ])->with('error', 'Bạn đã mua chapter này rồi');
        }

        // Use PaymentService to purchase chapter
        try {
            $purchase = $this->paymentService->purchaseChapter($user, $chapter);

            return redirect()->route('chapter.show', [
                'slug' => $comic->slug,
                'chapter_id' => $chapter->id
            ])->with('success', 'Mua chapter thành công');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
