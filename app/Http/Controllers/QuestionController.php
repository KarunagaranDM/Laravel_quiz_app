<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class QuestionController extends Controller
{
    public function index()
    {
        // Explicitly return JSON response
        return response()->json(
            Question::inRandomOrder()->limit(5)->get()
        );
    }

    public function submitQuiz(Request $request)
    {
        try {
            // Validate the request
            $validatedData = $request->validate([
                'questions' => 'required|array|min:1',
                'answers' => 'required|array',
                'answers.*' => 'nullable|string',
            ]);

            $questions = $request->input('questions', []);
            $answers = $request->input('answers', []);

            // Check if questions are provided
            $totalQuestions = count($questions);
            if ($totalQuestions === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No questions provided',
                ], 400);
            }

            // Calculate results
            $correctAnswers = 0;
            $detailedResults = [];

            // Fetch correct answers from the database
            $dbQuestions = Question::whereIn('id', array_column($questions, 'id'))->get()->keyBy('id');

            foreach ($questions as $question) {
                $questionId = $question['id'];
                $userAnswer = $answers[$questionId] ?? null;

                $dbQuestion = $dbQuestions->get($questionId);

                if (!$dbQuestion) {
                    Log::warning("Question not found in database: {$questionId}");
                    continue;
                }

                $isCorrect = $userAnswer === $dbQuestion->correct_answer;

                if ($isCorrect) {
                    $correctAnswers++;
                }

                $detailedResults[] = [
                    'question_id' => $questionId,
                    'user_answer' => $userAnswer,
                    'correct_answer' => $dbQuestion->correct_answer,
                    'is_correct' => $isCorrect
                ];
            }

            // Calculate score
            $scorePercentage = $totalQuestions > 0
                ? round(($correctAnswers / $totalQuestions) * 100, 2)
                : 0;

            // Save result without user_id (if Result model allows nullable user_id)
            $result = Result::create([
                'score' => $scorePercentage,
                'answers' => $answers
            ]);

            // Generate feedback
            $feedback = $this->generateFeedback($scorePercentage);

            return response()->json([
                'success' => true,
                'result' => [
                    'id' => $result->id,
                    'total_questions' => $totalQuestions,
                    'correct_answers' => $correctAnswers,
                    'score_percentage' => $scorePercentage,
                    'feedback' => $feedback,
                    'detailed_results' => $detailedResults
                ]
            ], 200);
        } catch (ValidationException $e) {
            Log::error('Validation Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error Details: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error_details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    private function generateFeedback($percentage)
    {
        if ($percentage >= 90) {
            return "Excellent performance! You demonstrate mastery of the subject.";
        } elseif ($percentage >= 80) {
            return "Very good job. You have a strong understanding.";
        } elseif ($percentage >= 70) {
            return "Good performance. Some areas for improvement exist.";
        } elseif ($percentage >= 60) {
            return "Satisfactory. Consider reviewing challenging topics.";
        } else {
            return "Needs significant improvement. Recommend comprehensive review.";
        }
    }
}
