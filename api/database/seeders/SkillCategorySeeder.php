<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SkillCategory;

class SkillCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'title' => 'Backend Development',
                'icon' => 'FiServer',
                'skills' => ['Node.js', 'Python', 'Java', 'PHP', 'Ruby'],
                'order_index' => 1
            ],
            [
                'title' => 'Databases',
                'icon' => 'FiDatabase',
                'skills' => ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'],
                'order_index' => 2
            ],
            [
                'title' => 'Cloud & DevOps',
                'icon' => 'FiCloud',
                'skills' => ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
                'order_index' => 3
            ],
            [
                'title' => 'APIs & Frameworks',
                'icon' => 'FiCode',
                'skills' => ['Express', 'Django', 'FastAPI', 'GraphQL', 'REST'],
                'order_index' => 4
            ],
            [
                'title' => 'Security',
                'icon' => 'FiLock',
                'skills' => ['OAuth', 'JWT', 'SSL/TLS', 'Encryption', 'OWASP'],
                'order_index' => 5
            ],
            [
                'title' => 'Performance',
                'icon' => 'FiZap',
                'skills' => ['Caching', 'Load Balancing', 'CDN', 'Optimization', 'Monitoring'],
                'order_index' => 6
            ]
        ];

        foreach ($categories as $category) {
            SkillCategory::updateOrCreate(['title' => $category['title']], $category);
        }
    }
}
