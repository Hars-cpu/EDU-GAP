import express from "express";
import {
  signup,
  login,
  getCurrentUser,
  logout
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/current-user", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;