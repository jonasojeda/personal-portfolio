<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SkillCategory;

class SkillCategoryController extends Controller
{
    public function index()
    {
        return response()->json(SkillCategory::orderBy('order_index')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:100',
            'skills' => 'required|array',
            'skills.*' => 'string',
            'order_index' => 'integer'
        ]);

        $skillCategory = SkillCategory::create($validated);
        return response()->json($skillCategory, 201);
    }

    public function update(Request $request, $id)
    {
        $skillCategory = SkillCategory::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'icon' => 'sometimes|string|max:100',
            'skills' => 'sometimes|array',
            'skills.*' => 'string',
            'order_index' => 'sometimes|integer'
        ]);

        $skillCategory->update($validated);
        return response()->json($skillCategory);
    }

    public function destroy($id)
    {
        $skillCategory = SkillCategory::findOrFail($id);
        $skillCategory->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
