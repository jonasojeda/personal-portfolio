<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\ContactMessage;

class ContactMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'phone' => '+1555123456',
                'message' => 'Hello! I love your portfolio. I would like to discuss a potential web development project with you.',
            ],
            [
                'first_name' => 'María',
                'last_name' => 'Pérez',
                'email' => 'maria.perez@example.com',
                'phone' => '+34600123456',
                'message' => 'Hola, me interesa tu perfil para una vacante de desarrollador Fullstack en nuestra empresa. ¿Cuándo tienes disponibilidad para una llamada?',
            ],
            [
                'first_name' => 'Alex',
                'last_name' => 'Smith',
                'email' => 'alex.smith@example.com',
                'phone' => null,
                'message' => 'Great work on the UI designs! Let\'s connect on LinkedIn.',
            ]
        ];

        foreach ($messages as $msg) {
            ContactMessage::create($msg);
        }
    }
}
