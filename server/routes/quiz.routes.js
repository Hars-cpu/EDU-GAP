import express from "express";
import {
  completeQuiz,
  createQuiz,
  deleteQuiz,
  getQuizById,
  submitQuestionAnswer,
} from "../controllers/quiz.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createQuiz);
router.get("/:id", getQuizById);
router.post("/:quizId/question/:questionIndex/answer", submitQuestionAnswer);
router.post("/:quizId/complete", completeQuiz);
router.delete("/:id", deleteQuiz);

export default router;
