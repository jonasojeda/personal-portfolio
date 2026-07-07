<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index($lang = null)
    {
        $query = Project::orderBy('order_index');
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
            'description' => 'nullable|string|max:255',
            'long_description' => 'nullable|string',
            'github_url' => 'nullable|string',
            'deploy_url' => 'nullable|string',
            'media' => 'nullable|array',
            'order_index' => 'integer'
        ]);

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        $validated = $request->validate([
            'lang' => 'sometimes|string|in:en,es',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:255',
            'long_description' => 'nullable|string',
            'github_url' => 'nullable|string',
            'deploy_url' => 'nullable|string',
            'media' => 'nullable|array',
            'order_index' => 'sometimes|integer'
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            // Assuming default storage URL configuration
            $url = url('storage/' . $path);
            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No image provided'], 400);
    }
}
