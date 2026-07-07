<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'lang' => 'en',
                'title' => 'Full Stack Developer',
                'company' => 'Current Company',
                'date' => '2023 - Present',
                'description' => 'Development and maintenance of modern web applications. Participation in the complete software development lifecycle, from design to deployment.',
                'order_index' => 1
            ],
            [
                'lang' => 'en',
                'title' => 'Junior Front-End Developer',
                'company' => 'Digital Agency',
                'date' => '2021 - 2023',
                'description' => 'Creation of interactive and responsive user interfaces using React and CSS. Close collaboration with design teams.',
                'order_index' => 2
            ],
            [
                'lang' => 'en',
                'title' => 'Engineering / Systems Student',
                'company' => 'Technological University',
                'date' => '2018 - 2022',
                'description' => 'Academic training in computer fundamentals, algorithms, databases, and agile methodologies.',
                'order_index' => 3
            ],
            [
                'lang' => 'es',
                'title' => 'Desarrollador Full Stack',
                'company' => 'Empresa Actual',
                'date' => '2023 - Presente',
                'description' => 'Desarrollo y mantenimiento de aplicaciones web modernas. Participación en el ciclo completo de desarrollo de software, desde el diseño hasta el despliegue.',
                'order_index' => 1
            ],
            [
                'lang' => 'es',
                'title' => 'Desarrollador Front-End Junior',
                'company' => 'Agencia Digital',
                'date' => '2021 - 2023',
                'description' => 'Creación de interfaces de usuario interactivas y responsivas utilizando React y CSS. Colaboración estrecha con equipos de diseño.',
                'order_index' => 2
            ],
            [
                'lang' => 'es',
                'title' => 'Estudiante de Ingeniería / Sistemas',
                'company' => 'Universidad Tecnológica',
                'date' => '2018 - 2022',
                'description' => 'Formación académica en fundamentos de la computación, algoritmos, bases de datos y metodologías ágiles.',
                'order_index' => 3
            ]
        ];

        foreach ($experiences as $exp) {
            Experience::create($exp);
        }
    }
}
