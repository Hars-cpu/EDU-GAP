import Quiz from "../models/Quiz.js";
import StudentAnalytics from "../models/StudentAnalytics.js";

import {
    generateQuizQuestions,
    generateProgressAnalysis
} from "../ai/quizAgent.js";


export const createQuiz = async (req, res) => {
    try {

        const studentId = req.user._id;

        const {
            chatSummary,
            
            sourceTitle
        } = req.body;

        const file = req.file || null;


        // 1. Generate quiz questions using AI agent

        const questions = await generateQuizQuestions({
            chatSummary,
            
            file
        });


        // 2. Get student's progress analysis

        const analysis = await generateProgressAnalysis({
            chatSummary,
            topics,
            questions
        });


        // 3. Create quiz

        const quiz = await Quiz.create({

            student: studentId,

            sourceTitle: sourceTitle || null,

            origin: "chat",

            topics: topics || [],

            questions,

            totalQuestions: questions.length,

            strengths: analysis.strongTopics || [],

            weakTopics: analysis.weakTopics || [],

            status: "in_progress"
        });


        // 4. Find student's analytics

        let analytics = await StudentAnalytics.findOne({
            student: studentId
        });


        // 5. Create analytics if it doesn't exist

        if (!analytics) {

            analytics = await StudentAnalytics.create({
                student: studentId,
                recentQuizzes: [],
                overallProgressSummary: "",
                weakTopics: []
            });

        }


        // 6. Add new quiz at the beginning

        analytics.recentQuizzes.unshift(quiz._id);


        // 7. If more than 3 quizzes,
        //    remove the oldest one

        if (analytics.recentQuizzes.length > 3) {

            const oldestQuizId =
                analytics.recentQuizzes.pop();

            await Quiz.findByIdAndDelete(oldestQuizId);
        }


        // 8. Update student's progress

        analytics.overallProgressSummary =
            analysis.overallProgressSummary || "";

        analytics.weakTopics =
            analysis.weakTopics || [];


        await analytics.save();


        // 9. Don't send correct answers to frontend

        const quizResponse = {
            _id: quiz._id,

            topics: quiz.topics,

            totalQuestions: quiz.totalQuestions,

            questions: quiz.questions.map((question) => ({
                _id: question._id,
                questionText: question.questionText,
                options: question.options
            }))
        };


        return res.status(201).json({

            success: true,

            message: "Quiz generated successfully",

            quiz: quizResponse

        });

    } catch (error) {

        console.error("Create Quiz Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate quiz"
        });
    }
};