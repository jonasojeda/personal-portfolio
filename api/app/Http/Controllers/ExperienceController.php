<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Experience;

class ExperienceController extends Controller
{
    public function index($lang = null)
    {
        $query = Experience::orderBy('order_index');
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
            'company' => 'required|string|max:255',
            'date' => 'required|string|max:255',
            'description' => 'required|string',
            'order_index' => 'integer'
        ]);

        $experience = Experience::create($validated);
        return response()->json($experience, 201);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::findOrFail($id);
        
        $validated = $request->validate([
            'lang' => 'sometimes|string|in:en,es',
            'title' => 'sometimes|string|max:255',
            'company' => 'sometimes|string|max:255',
            'date' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'order_index' => 'sometimes|integer'
        ]);

        $experience->update($validated);
        return response()->json($experience);
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
