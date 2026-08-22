import express from "express";

import {
    createQuiz,
    getQuizById,
    submitQuestionAnswer,
    completeQuiz,
    deleteQuiz
} from "../controllers/quiz.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// Create quiz
router.post(
    "/",
    // protect,
    createQuiz
);


// Get quiz by ID
router.get(
    "/:id",
    // protect,
    getQuizById
);


// Submit answer for one question
router.post(
    "/:quizId/question/:questionIndex/answer",
    // protect,
    submitQuestionAnswer
);


// Complete quiz
router.post(
    "/:quizId/complete",
    // protect,
    completeQuiz
);


// Delete quiz
router.delete(
    "/:id",
    // protect,
    deleteQuiz
);

export default router;