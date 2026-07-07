<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'lang', 'title', 'description', 'long_description', 
        'github_url', 'deploy_url', 'media', 'order_index'
    ];

    protected $casts = [
        'media' => 'array'
    ];
}
