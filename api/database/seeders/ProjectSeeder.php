<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            // English
            [
                'lang' => 'en',
                'title' => 'Pokemon app',
                'description' => 'Api rest Pokemon',
                'long_description' => 'A complete application that consumes the PokeAPI to display detailed information about Pokémon, their abilities, and statistics. It features real-time search, type filtering, and a responsive design.',
                'github_url' => 'https://github.com/jonasojeda/Pokemn_App',
                'deploy_url' => 'https://pokemn-app.vercel.app/',
                'media' => [
                    ['type' => 'youtube', 'url' => 'https://www.youtube.com/watch?v=u4vDry9uJZ0']
                ],
                'order_index' => 1
            ],
            [
                'lang' => 'en',
                'title' => 'Scanea-me',
                'description' => 'E-commerce',
                'long_description' => 'E-commerce platform developed with modern technologies. It allows users to scan products, add them to their shopping cart, and complete the checkout process securely and quickly.',
                'github_url' => 'https://github.com/jonasojeda/scaneaMe',
                'deploy_url' => 'https://scaneame.vercel.app/home',
                'media' => [],
                'order_index' => 2
            ],
            [
                'lang' => 'en',
                'title' => 'ToDo App',
                'description' => 'Todo list',
                'long_description' => 'A daily task management application. Allows creating, editing, deleting, and marking tasks as completed. Implements local storage to keep data persistently.',
                'github_url' => 'https://github.com/jonasojeda/todo-app',
                'deploy_url' => 'https://jonas-dev-todo-app.netlify.app/',
                'media' => [
                    ['type' => 'youtube', 'url' => 'https://youtu.be/TaOhHlL7zVE']
                ],
                'order_index' => 3
            ],
            // Spanish
            [
                'lang' => 'es',
                'title' => 'Pokemon app',
                'description' => 'Api rest Pokemon',
                'long_description' => 'Una aplicación completa que consume la PokeAPI para mostrar información detallada de los Pokémon, sus habilidades y estadísticas. Cuenta con búsqueda en tiempo real, filtrado por tipos, y un diseño responsivo.',
                'github_url' => 'https://github.com/jonasojeda/Pokemn_App',
                'deploy_url' => 'https://pokemn-app.vercel.app/',
                'media' => [
                    ['type' => 'youtube', 'url' => 'https://www.youtube.com/watch?v=u4vDry9uJZ0']
                ],
                'order_index' => 1
            ],
            [
                'lang' => 'es',
                'title' => 'Scanea-me',
                'description' => 'E-commerce',
                'long_description' => 'Plataforma de E-commerce desarrollada con tecnologías modernas. Permite a los usuarios escanear productos, agregarlos a su carrito de compras y realizar el proceso de pago de forma segura y rápida.',
                'github_url' => 'https://github.com/jonasojeda/scaneaMe',
                'deploy_url' => 'https://scaneame.vercel.app/home',
                'media' => [],
                'order_index' => 2
            ],
            [
                'lang' => 'es',
                'title' => 'ToDo App',
                'description' => 'Todo list',
                'long_description' => 'Una aplicación de gestión de tareas diarias. Permite crear, editar, eliminar y marcar tareas como completadas. Implementa almacenamiento local para mantener los datos de forma persistente.',
                'github_url' => 'https://github.com/jonasojeda/todo-app',
                'deploy_url' => 'https://jonas-dev-todo-app.netlify.app/',
                'media' => [
                    ['type' => 'youtube', 'url' => 'https://youtu.be/TaOhHlL7zVE']
                ],
                'order_index' => 3
            ]
        ];

        foreach ($projects as $proj) {
            Project::create($proj);
        }
    }
}
