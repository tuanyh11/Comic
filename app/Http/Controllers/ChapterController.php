<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Services\PaymentService;
use App\Services\ReadingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChapterController extends Controller
{

    protected PaymentService $paymentService;
    protected ReadingService $readingService;

    public function __construct(PaymentService $paymentService, ReadingService $readingService)
    {
        $this->paymentService = $paymentService;
        $this->readingService = $readingService;
    }

    public function show($id, $chapter_id)
    {
        $chapter = Chapter::where('id', $chapter_id)
            ->with('media')
            ->firstOrFail();

        // Kiểm tra xem người dùng hiện tại đã vote chưa
        $hasVoted = false;

        // Kiểm tra xem chapter có phải nội dung trả phí không
        $isPaidContent = $chapter->isPaidContent();

        // Mặc định trạng thái là chưa mở khóa
        $isUnlocked = false;

        if (Auth::check()) {
            $user = Auth::user();
            $hasVoted = $chapter->voters()->where('user_id', $user->id)->exists();

            // Nếu là nội dung trả phí, kiểm tra xem người dùng đã mua chưa
            if ($isPaidContent) {
                $isUnlocked = $chapter->isAccessibleBy($user);
            }
        }

        // Nếu chapter không phải nội dung trả phí, đánh dấu là đã mở khóa
        if (!$isPaidContent) {
            $isUnlocked = true;
        }

        // Thêm thông tin đã vote và trạng thái mở khóa vào dữ liệu trả về
        $chapter->has_voted = $hasVoted;
        $chapter->is_paid_content = $isPaidContent;
        $chapter->is_unlocked = $isUnlocked;

        // Ghi lại lượt đọc nếu đã đăng nhập và chapter đã mở khóa
        if ($isUnlocked && Auth::check()) {
            $this->readingService->recordReading(Auth::user(), $chapter);
        }

        // Nếu là nội dung trả phí và chưa được mở khóa, chuyển hướng đến trang mua chapter
        if ($isPaidContent && !$isUnlocked) {
            return Inertia::render('Comic/ChapterLocked', [
                "chapter" => $chapter,
                "walletBalance" => Auth::check() ? $this->paymentService->getWalletBalance(Auth::user()) : 0
            ]);
        }

        return Inertia::render('Comic/Chapter', [
            "chapter" => $chapter,
        ]);
    }

    public function showIframe($id, $chapter_id)
    {
        $chapter = Chapter::where('id', $chapter_id)
            ->with('media')
            ->firstOrFail();

        // Kiểm tra xem người dùng hiện tại đã vote chưa
        $hasVoted = false;

        // Kiểm tra xem chapter có phải nội dung trả phí không
        $isPaidContent = $chapter->isPaidContent();

        // Mặc định trạng thái là chưa mở khóa
        $isUnlocked = false;

        if (Auth::check()) {
            $user = Auth::user();
            $hasVoted = $chapter->voters()->where('user_id', $user->id)->exists();

            // Nếu là nội dung trả phí, kiểm tra xem người dùng đã mua chưa
            if ($isPaidContent) {
                $isUnlocked = $chapter->isAccessibleBy($user);
            }
        }

        // Nếu chapter không phải nội dung trả phí, đánh dấu là đã mở khóa
        if (!$isPaidContent) {
            $isUnlocked = true;
        }

        // Thêm thông tin đã vote và trạng thái mở khóa vào dữ liệu trả về
        $chapter->has_voted = $hasVoted;
        $chapter->is_paid_content = $isPaidContent;
        $chapter->is_unlocked = $isUnlocked;

        // Tăng số lượt đọc nếu người dùng có quyền truy cập vào chapter
        if ($isUnlocked) {
            $chapter->increment('read_count');
        }

        // Nếu là nội dung trả phí và chưa được mở khóa, chuyển hướng đến trang mua chapter
        if ($isPaidContent && !$isUnlocked) {
            return Inertia::render('Comic/ChapterLocked', [
                "chapter" => $chapter,
                "walletBalance" => Auth::check() ? $this->paymentService->getWalletBalance(Auth::user()) : 0
            ]);
        }

        return view('comic/chapter', [
            "chapter" => $chapter,
        ]);
    }

    /**
     * Xử lý vote cho chapter
     */
    public function vote(Request $request, $chapter_id)
    {
        // Kiểm tra người dùng đã đăng nhập
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để vote'
            ], 401);
        }

        $chapter = Chapter::findOrFail($chapter_id);
        $user = Auth::user();

        // Kiểm tra nếu là nội dung trả phí, người dùng cần mở khóa trước khi vote
        if ($chapter->isPaidContent() && !$chapter->isAccessibleBy($user)) {
            return response()->json([
                'message' => 'Bạn cần mở khóa chapter này trước khi vote'
            ], 403);
        }

        // Kiểm tra xem người dùng đã vote chưa
        $hasVoted = $chapter->voters()->where('user_id', $user->id)->exists();

        if ($hasVoted) {
            // Nếu đã vote, hủy vote
            $chapter->voters()->detach($user->id);
            $chapter->decrement('vote_count');
            $message = 'Đã hủy vote thành công';
            $voted = false;
        } else {
            // Nếu chưa vote, thêm vote
            $chapter->voters()->attach($user->id);
            $chapter->increment('vote_count');
            $message = 'Đã vote thành công';
            $voted = true;
        }

        return response()->json([
            'message' => $message,
            'voted' => $voted,
            'vote_count' => $chapter->vote_count
        ]);
    }

    /**
     * Hiển thị trang mua chapter
     */
    public function purchase(Chapter $chapter)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('message', 'Vui lòng đăng nhập để mua chapter');
        }

        // Nếu người dùng đã mua chapter này, chuyển hướng đến trang chapter
        if ($chapter->isAccessibleBy(Auth::user())) {
            return redirect()->route('chapters.show', $chapter->id);
        }

        return Inertia::render('Comic/ChapterPurchase', [
            'chapter' => $chapter->load('comic'),
            'walletBalance' => $this->paymentService->getWalletBalance(Auth::user()),
        ]);
    }

    /**
     * Xử lý mua chapter
     */
    public function processPurchase(Request $request, Chapter $chapter)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để mua chapter'
            ], 401);
        }

        $user = Auth::user();

        // Kiểm tra xem người dùng đã mua chapter này chưa
        if ($chapter->isAccessibleBy($user)) {
            return response()->json([
                'message' => 'Bạn đã mua chapter này rồi',
                'success' => true
            ]);
        }

        // TODO: Thêm logic xử lý thanh toán ở đây
        // Ví dụ: Kiểm tra số dư tài khoản, trừ tiền, v.v.

        // Ghi nhận việc mua chapter
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
     * Mua chapter bằng số dư ví
     */
    public function purchaseWithWallet(Request $request, $chapter_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn cần đăng nhập để mua chapter'
            ], 401);
        }

        $user = Auth::user();
        $chapter = Chapter::findOrFail($chapter_id);

        // Kiểm tra xem chapter có phải nội dung trả phí không
        if (!$chapter->isPaidContent()) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter này là nội dung miễn phí'
            ]);
        }

        // Kiểm tra xem người dùng đã mua chapter này chưa
        if ($chapter->isAccessibleBy($user)) {
            return response()->json([
                'success' => true,
                'message' => 'Bạn đã mua chapter này rồi'
            ]);
        }

        // Sử dụng PaymentService để mua chapter
        try {
            $purchase = $this->paymentService->purchaseChapter($user, $chapter);

            return response()->json([
                'success' => true,
                'message' => 'Mua chapter thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
