import express from "express";

import {
    getAnalytics,
    getInProgressQuizzes
} from "../controllers/analytics.controller.js";

// import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// Analytics + latest 3 completed quizzes
router.get(
    "/",
    // protect,
    getAnalytics
);


// Only in-progress quizzes
router.get(
    "/quizzes",
    // protect,
    getInProgressQuizzes
);


export default router;