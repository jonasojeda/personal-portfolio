<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $markdownEn = <<<EOT
## Introduction to Modern Web Development

The web is evolving rapidly. Every day new tools, frameworks, and patterns emerge.

### Key concepts
1. **React**: A javascript library for building user interfaces.
2. **Laravel**: A powerful PHP framework for building robust APIs.
3. **TailwindCSS**: Utility-first CSS framework.

Here is a simple example of a React component:

```jsx
export const HelloWorld = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}
```

> "The only way to write good code is to write tons of bad code first."
EOT;

        $markdownEs = <<<EOT
## Introducción al Desarrollo Web Moderno

La web evoluciona rápidamente. Todos los días surgen nuevas herramientas, frameworks y patrones.

### Conceptos clave
1. **React**: Una librería de Javascript para crear interfaces de usuario.
2. **Laravel**: Un framework de PHP potente para crear APIs robustas.
3. **TailwindCSS**: Framework CSS basado en utilidades.

Aquí hay un ejemplo simple de un componente de React:

```jsx
export const HelloWorld = () => {
  return (
    <div>
      <h1>¡Hola, Mundo!</h1>
    </div>
  );
}
```

> "La única forma de escribir buen código es escribir toneladas de código malo primero."
EOT;

        $blogs = [
            [
                'lang' => 'en',
                'title' => 'The Future of Web Development',
                'excerpt' => 'A brief look into where the web is heading in the next few years.',
                'content' => $markdownEn,
                'cover_image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'author_name' => 'Jonás Ojeda',
                'published_at' => '2023-10-15',
                'order_index' => 1
            ],
            [
                'lang' => 'es',
                'title' => 'El Futuro del Desarrollo Web',
                'excerpt' => 'Una breve mirada hacia dónde se dirige la web en los próximos años.',
                'content' => $markdownEs,
                'cover_image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'author_name' => 'Jonás Ojeda',
                'published_at' => '2023-10-15',
                'order_index' => 1
            ]
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }
    }
}
