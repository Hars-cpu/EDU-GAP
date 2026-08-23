import express from "express";
import {
  signup,
  login,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/current-user", protect, getCurrentUser);

export default router;