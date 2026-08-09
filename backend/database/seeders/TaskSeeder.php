<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\Task;
use App\Models\User;
use App\Models\Veribot;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('role', 'teacher')->first();
        if (!$teacher) return;

        $sections = Section::where('teacher_id', $teacher->id)->get();
        if ($sections->isEmpty()) return;

        foreach ($sections as $section) {
            $task = Task::create([
                'teacher_id' => $teacher->id,
                'section_id' => $section->id,
                'title' => 'Verify: The Dangers of Dihydrogen Monoxide',
                'target_media_url' => 'https://dhmo.org'
            ]);

            $task2 = Task::create([
                'teacher_id' => $teacher->id,
                'section_id' => $section->id,
                'title' => 'Verify: Moon Landing Hoax',
                'target_media_url' => 'https://en.wikipedia.org/wiki/Moon_landing_conspiracy_theories'
            ]);

            $students = $section->students;
            foreach ($students as $student) {
                $task->students()->attach($student->id, ['score' => rand(60, 100)]);
                $task2->students()->attach($student->id, ['score' => rand(50, 90)]);

                Veribot::create([
                    'user_id' => $student->id,
                    'task_id' => $task->id,
                    'title' => 'DHMO Verification',
                    'input_query' => 'Is DHMO dangerous?',
                    'quiz_score' => rand(70, 100),
                    'bias_detected' => rand(1, 10) > 7,
                    'details' => json_encode([
                        'ground_truth_verdict' => (rand(1, 10) > 6) ? 'misleading' : 'true'
                    ])
                ]);

                Veribot::create([
                    'user_id' => $student->id,
                    'task_id' => $task2->id,
                    'title' => 'Moon Landing Verification',
                    'input_query' => 'Did we really land on the moon?',
                    'quiz_score' => rand(70, 100),
                    'bias_detected' => rand(1, 10) > 8,
                    'details' => json_encode([
                        'ground_truth_verdict' => 'false'
                    ])
                ]);
                
                Veribot::create([
                    'user_id' => $student->id,
                    'task_id' => null,
                    'title' => 'Random Verification',
                    'input_query' => 'Is coffee good for you?',
                    'quiz_score' => rand(80, 100),
                    'bias_detected' => false,
                    'details' => json_encode([
                        'ground_truth_verdict' => 'true'
                    ])
                ]);
            }
        }
    }
}
