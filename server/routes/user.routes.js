import express from "express";

import {
  getAllStudents,
} from "../controllers/user.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/students",
   protect,
  getAllStudents
);

export default router;