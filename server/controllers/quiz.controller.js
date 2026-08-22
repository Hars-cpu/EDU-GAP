import Quiz from "../models/Quiz.js";
import StudentAnalytics from "../models/StudentAnalytics.js";

import {
    generateQuizQuestions,
    analyzeCurrentQuiz,
    generateProgressSummary
} from "../ai/quizAgent.js";


// ======================================================
// CREATE QUIZ
// ======================================================

export const createQuiz = async (req, res) => {
    try {
        const studentId = req.user._id;

        const {
            chatSummary,
            topics,
            sourceTitle
        } = req.body;

        const file = req.file || null;


        // Generate questions from chat summary + file
        const questions = await generateQuizQuestions({
            chatSummary,
            topics,
            file
        });


        // Create quiz
        const quiz = await Quiz.create({
            student: studentId,

            sourceTitle: sourceTitle || null,

            origin: "chat",

            topics: topics || [],

            questions,

            totalQuestions: questions.length,

            status: "in_progress"
        });


        // Don't send correct answers to frontend
        const quizResponse = {
            _id: quiz._id,

            sourceTitle: quiz.sourceTitle,

            topics: quiz.topics,

            totalQuestions: quiz.totalQuestions,

            status: quiz.status,

            questions: quiz.questions.map((question) => ({
                _id: question._id,
                questionText: question.questionText,
                options: question.options
            }))
        };


        return res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz: quizResponse
        });

    } catch (error) {

        console.error("Create Quiz Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create quiz"
        });
    }
};



// ======================================================
// GET QUIZ BY ID
// ======================================================

export const getQuizById = async (req, res) => {
    try {

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            student: req.user._id
        }).select("-questions.correctAnswer");


        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }


        return res.status(200).json({
            success: true,
            quiz
        });

    } catch (error) {

        console.error("Get Quiz Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get quiz"
        });
    }
};



// ======================================================
// GET ALL QUIZZES
// ======================================================
//
// Returns:
// - ALL in-progress quizzes
// - ALL completed quizzes
//
// Since completeQuiz deletes the oldest completed quiz
// whenever completed quizzes > 3, this effectively means:
//
// ALL in-progress + latest 3 completed
//
// ======================================================





// ======================================================
// SUBMIT ANSWER FOR ONE QUESTION
// ======================================================
//
// Route:
// POST /api/quiz/:quizId/question/:questionIndex/answer
//
// Body:
// {
//     "answer": "Option B"
// }
//
// ======================================================

export const submitQuestionAnswer = async (req, res) => {
    try {

        const {
            quizId,
            questionIndex
        } = req.params;

        const { answer } = req.body;


        // Find quiz belonging to logged-in student
        const quiz = await Quiz.findOne({
            _id: quizId,
            student: req.user._id
        });


        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }


        // Cannot answer completed quiz
        if (quiz.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Quiz is already completed"
            });
        }


        const index = Number(questionIndex);


        // Validate question index
        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= quiz.questions.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid question index"
            });
        }


        const question = quiz.questions[index];


        // Save student's answer
        question.selectedAnswer = answer;


        // Check answer
        question.isCorrect =
            answer === question.correctAnswer;


        await quiz.save();


        return res.status(200).json({
            success: true,
            message: "Answer submitted successfully"
        });

    } catch (error) {

        console.error("Submit Answer Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit answer"
        });
    }
};



// ======================================================
// COMPLETE QUIZ
// ======================================================

export const completeQuiz = async (req, res) => {
    try {

        const studentId = req.user._id;

        const { quizId } = req.params;


        // --------------------------------------------------
        // 1. Find quiz
        // --------------------------------------------------

        const quiz = await Quiz.findOne({
            _id: quizId,
            student: studentId
        });


        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }


        // --------------------------------------------------
        // 2. Check if already completed
        // --------------------------------------------------

        if (quiz.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Quiz already completed"
            });
        }


        // --------------------------------------------------
        // 3. Calculate current quiz score
        // --------------------------------------------------

        let score = 0;


        quiz.questions.forEach((question) => {

            if (question.isCorrect === true) {
                score++;
            }

        });


        quiz.score = score;

        quiz.status = "completed";

        quiz.completedAt = new Date();


        // --------------------------------------------------
        // 4. Analyze CURRENT quiz
        // --------------------------------------------------
        //
        // This analysis is ONLY for this quiz.
        //
        // Returns:
        // - strongTopics
        // - weakTopics
        //
        // --------------------------------------------------

        const quizAnalysis =
            await analyzeCurrentQuiz({
                quiz
            });


        quiz.strengths =
            quizAnalysis.strongTopics || [];


        quiz.weakTopics =
            quizAnalysis.weakTopics || [];


        await quiz.save();



        // --------------------------------------------------
        // 5. Get completed quizzes
        // --------------------------------------------------
        //
        // IMPORTANT:
        // We ONLY count completed quizzes.
        //
        // in_progress quizzes are never considered here.
        //
        // --------------------------------------------------

        let completedQuizzes = await Quiz.find({
            student: studentId,
            status: "completed"
        })
            .sort({
                completedAt: -1
            });



        // --------------------------------------------------
        // 6. Keep only 3 completed quizzes
        // --------------------------------------------------

        if (completedQuizzes.length > 3) {

            // Last item = oldest because sorted newest → oldest
            const oldestQuiz =
                completedQuizzes[
                    completedQuizzes.length - 1
                ];


            // Delete oldest completed quiz
            await Quiz.findByIdAndDelete(
                oldestQuiz._id
            );


            // Remove it from local array
            completedQuizzes.pop();
        }



        // --------------------------------------------------
        // 7. Generate overall progress
        // --------------------------------------------------
        //
        // Only last 3 completed quizzes are sent.
        //
        // If there are zero completed quizzes,
        // don't call the agent.
        //
        // --------------------------------------------------

        let progressAnalysis = {
            progressSummary: "",
            weakTopics: []
        };


        if (completedQuizzes.length > 0) {

            progressAnalysis =
                await generateProgressSummary({
                    quizzes: completedQuizzes
                });
        }



        // --------------------------------------------------
        // 8. Update StudentAnalytics
        // --------------------------------------------------

        let analytics =
            await StudentAnalytics.findOne({
                student: studentId
            });


        // Create analytics if it doesn't exist
        if (!analytics) {

            analytics =
                await StudentAnalytics.create({
                    student: studentId,

                    recentQuizzes: [],

                    overallProgressSummary: "",

                    weakTopics: []
                });
        }


        // Store latest 3 completed quiz IDs
        analytics.recentQuizzes =
            completedQuizzes.map(
                (quiz) => quiz._id
            );


        // Overall progress based on last 3 quizzes
        analytics.overallProgressSummary =
            progressAnalysis.progressSummary || "";


        // Overall weak topics based on last 3 quizzes
        analytics.weakTopics =
            progressAnalysis.weakTopics || [];


        await analytics.save();



        // --------------------------------------------------
        // 9. Return result
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Quiz completed successfully",

            result: {

                // Current quiz
                score: quiz.score,

                totalQuestions:
                    quiz.totalQuestions,

                strengths:
                    quiz.strengths,

                weakTopics:
                    quiz.weakTopics,


                // Overall student progress
                overallProgressSummary:
                    analytics.overallProgressSummary,

                overallWeakTopics:
                    analytics.weakTopics
            }
        });

    } catch (error) {

        console.error(
            "Complete Quiz Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to complete quiz"
        });
    }
};



// ======================================================
// DELETE QUIZ
// ======================================================

export const deleteQuiz = async (req, res) => {
    try {

        const studentId = req.user._id;


        // Delete only if quiz belongs to student
        const quiz = await Quiz.findOneAndDelete({
            _id: req.params.id,
            student: studentId
        });


        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }


        // Remove quiz ID from analytics
        await StudentAnalytics.findOneAndUpdate(
            {
                student: studentId
            },
            {
                $pull: {
                    recentQuizzes: quiz._id
                }
            }
        );


        return res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {

        console.error("Delete Quiz Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete quiz"
        });
    }
};