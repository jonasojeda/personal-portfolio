<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'lang', 'title', 'excerpt', 'content', 
        'cover_image', 'author_name', 'order_index', 'published_at'
    ];
}
