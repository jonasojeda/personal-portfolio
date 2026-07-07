<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CVController extends Controller
{
    /**
     * Handle the incoming CV file upload.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:10240', // Max 10MB
            'lang' => 'required|string|in:en,es',
        ]);

        $file = $request->file('cv');
        $lang = $request->lang;
        
        $filename = "cv_{$lang}.pdf";
        $path = $file->storeAs('', $filename, 'public');

        return response()->json([
            'message' => 'CV uploaded successfully',
            'url' => Storage::url($path)
        ]);
    }
}
