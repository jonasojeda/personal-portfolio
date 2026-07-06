<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use Illuminate\Http\Request;

class HeroSectionController extends Controller
{
    /**
     * Display the HeroSection content for all languages.
     */
    public function index()
    {
        $sections = HeroSection::all()->keyBy('lang');
        
        $response = [];
        foreach (['en', 'es'] as $lang) {
            $section = $sections->get($lang);
            $response[$lang] = $section ? [
                'tagline' => $section->tagline,
                'greeting' => $section->greeting,
                'roles' => $section->roles,
                'description' => $section->description,
                'connect' => $section->connect,
            ] : null;
        }
        
        return response()->json($response);
    }

    /**
     * Create or update the HeroSection content for a specific language.
     */
    public function update(Request $request)
    {
        $request->validate([
            'lang' => 'required|string|in:en,es',
            'tagline' => 'nullable|string',
            'greeting' => 'nullable|string',
            'roles' => 'nullable|array',
            'description' => 'nullable|string',
            'connect' => 'nullable|string',
        ]);

        $hero = HeroSection::updateOrCreate(
            ['lang' => $request->lang],
            $request->only(['tagline', 'greeting', 'roles', 'description', 'connect'])
        );

        return response()->json([
            'message' => 'Hero section updated successfully',
            'data' => $hero
        ]);
    }
}
