<?php

namespace App\Http\Controllers;

use App\Models\Term;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsController extends Controller
{
    /**
     * Display the terms of service page.
     */
    public function termsOfService()
    {
        $terms = Term::getLatestTermsOfService();
        
        return Inertia::render('Terms/TermsOfService', [
            'terms' => $terms ? [
                'title' => $terms->title,
                'content' => $terms->content,
                'version' => $terms->version,
                'published_at' => $terms->published_at->format('d/m/Y'),
            ] : null,
        ]);
    }

    /**
     * Display the privacy policy page.
     */
    public function privacyPolicy()
    {
        $privacy = Term::getLatestPrivacyPolicy();
        
        return Inertia::render('Terms/PrivacyPolicy', [
            'privacy' => $privacy ? [
                'title' => $privacy->title,
                'content' => $privacy->content,
                'version' => $privacy->version,
                'published_at' => $privacy->published_at->format('d/m/Y'),
            ] : null,
        ]);
    }
}