<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = [
            ['first_name' => 'Hamza', 'last_name' => 'React', 'email' => 'hamzareact@ofppt.ma', 'module_name' => 'react', 'password' => 'react123456'],
            ['first_name' => 'Pie', 'last_name' => 'Prof', 'email' => 'piepie@ofppt.ma', 'module_name' => 'pie', 'password' => 'pie123456'],
            ['first_name' => 'Francaie', 'last_name' => 'Prof', 'email' => 'francaiefr@ofppt.ma', 'module_name' => 'french', 'password' => 'fr123456'],
            ['first_name' => 'English', 'last_name' => 'Prof', 'email' => 'englisheng@ofppt.ma', 'module_name' => 'english', 'password' => 'eng123456'],
            ['first_name' => 'Uml', 'last_name' => 'Prof', 'email' => 'umluml@ofppt.ma', 'module_name' => 'uml', 'password' => 'uml123456'],
            ['first_name' => 'Laravel', 'last_name' => 'Toufella', 'email' => 'laraveltoufella@ofppt.ma', 'module_name' => 'laravel', 'password' => 'toufella123456'],
            ['first_name' => 'Approche', 'last_name' => 'Agile', 'email' => 'approcheagile@ofppt.ma', 'module_name' => 'approche agile', 'password' => 'approche123456'],
        ];

        foreach ($teachers as $teacher) {
            User::updateOrCreate(
                ['email' => $teacher['email']],
                [
                    'first_name' => $teacher['first_name'],
                    'last_name' => $teacher['last_name'],
                    'phone' => '0600000000',
                    'role' => 'teacher',
                    'module_name' => $teacher['module_name'],
                    'password' => Hash::make($teacher['password']),
                ]
            );
        }

        User::updateOrCreate(
            ['email' => 'azzedine.oubaid@ofppt.ma'],
            [
                'first_name' => 'Azzedine',
                'last_name' => 'Obaid',
                'phone' => '0600000001',
                'role' => 'developer',
                'password' => Hash::make('dev12345678'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'loubna.azmam@ofppt.ma'],
            [
                'first_name' => 'Loubna',
                'last_name' => 'Azmam',
                'phone' => '0600000002',
                'role' => 'developer',
                'password' => Hash::make('dev12345678'),
            ]
        );
    }
}
