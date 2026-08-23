import express from "express";

import { getAllStudents } from "../controllers/user.controller.js";

import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/students",
  protect,
  teacherOnly,
  getAllStudents
);

export default router;