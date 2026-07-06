<?php

namespace Database\Seeders;

use App\Models\HeroSection;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HeroSection::updateOrCreate(
            ['lang' => 'en'],
            [
                'tagline' => 'Welcome to my Portfolio',
                'greeting' => "Hi! I'm Jonas",
                'roles' => ["Web Developer", "Full Stack Developer", "Backend Developer"],
                'description' => 'I am passionate about creating efficient and scalable web applications. I love solving complex problems and turning ideas into reality.',
                'connect' => "Let's Connect",
            ]
        );

        HeroSection::updateOrCreate(
            ['lang' => 'es'],
            [
                'tagline' => 'Bienvenido a mi Portafolio',
                'greeting' => '¡Hola! Soy Jonas',
                'roles' => ["Desarrollador Web", "Desarrollador Full Stack", "Desarrollador Backend"],
                'description' => 'Me apasiona crear aplicaciones web eficientes y escalables. Me encanta resolver problemas complejos y convertir ideas en realidad.',
                'connect' => 'Conectar',
            ]
        );
    }
}
