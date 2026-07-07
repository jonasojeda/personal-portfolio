<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillCategory extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'icon', 'skills', 'order_index'];

    protected $casts = [
        'skills' => 'array',
    ];
}
