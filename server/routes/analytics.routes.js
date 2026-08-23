import express from "express";
import {
  getAnalytics,
  getInProgressQuizzes,
  getStudentAnalyticsForTeacher,
} from "../controllers/analytics.controller.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAnalytics);
router.get("/quizzes", getInProgressQuizzes);
router.get(
  "/teacher/student/:studentId/analytics",
  teacherOnly,
  getStudentAnalyticsForTeacher
);
export default router;
