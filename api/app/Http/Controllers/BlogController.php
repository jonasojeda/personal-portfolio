<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Blog;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index($lang = null)
    {
        $query = Blog::orderBy('order_index');
        if ($lang) {
            $query->where('lang', $lang);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lang' => 'required|string|in:en,es',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'author_name' => 'nullable|string|max:255',
            'order_index' => 'integer',
            'published_at' => 'nullable|date'
        ]);

        $blog = Blog::create($validated);
        return response()->json($blog, 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
        
        $validated = $request->validate([
            'lang' => 'sometimes|string|in:en,es',
            'title' => 'sometimes|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'author_name' => 'nullable|string|max:255',
            'order_index' => 'sometimes|integer',
            'published_at' => 'nullable|date'
        ]);

        $blog->update($validated);
        return response()->json($blog);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $url = url('storage/' . $path);
            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No image provided'], 400);
    }
}
