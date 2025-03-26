<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $questions = [
            [
                'question' => 'What is Laravel?',
                'options' => json_encode([
                    'A PHP framework',
                    'A JavaScript library',
                    'A CSS framework',
                    'A database system'
                ]),
                'correct_answer' => 'A PHP framework',
                'category' => 'laravel',
            ],
            [
                'question' => 'Which Laravel command creates a new controller?',
                'options' => json_encode([
                    'php artisan make:controller',
                    'php artisan create:controller',
                    'php artisan new:controller',
                    'php artisan generate:controller'
                ]),
                'correct_answer' => 'php artisan make:controller',
                'category' => 'laravel',
            ],
            [
                'question' => 'What is React.js primarily used for?',
                'options' => json_encode([
                    'Building user interfaces',
                    'Server-side rendering',
                    'Database management',
                    'CSS styling'
                ]),
                'correct_answer' => 'Building user interfaces',
                'category' => 'react',
            ],
            [
                'question' => 'In React, what is used to pass data to a component?',
                'options' => json_encode([
                    'Props',
                    'State',
                    'Components',
                    'Elements'
                ]),
                'correct_answer' => 'Props',
                'category' => 'react',
            ],
            [
                'question' => 'What does SQL stand for?',
                'options' => json_encode([
                    'Structured Query Language',
                    'Simple Query Language',
                    'Standard Query Language',
                    'System Query Language'
                ]),
                'correct_answer' => 'Structured Query Language',
                'category' => 'mysql',
            ],
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
