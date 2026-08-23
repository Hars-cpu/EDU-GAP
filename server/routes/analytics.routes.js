import express from "express";
import {
  getAnalytics,
  getInProgressQuizzes,
} from "../controllers/analytics.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAnalytics);
router.get("/quizzes", getInProgressQuizzes);

export default router;
