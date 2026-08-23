import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token missing.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    let user = null;
    if (User.db.readyState === 1) {
      user = await User.findById(decoded.id).select("-password");
    }
    // A verified token is enough for ephemeral chatbot data when Mongo is offline.
    user ||= { _id: decoded.id, id: decoded.id, role: decoded.role };

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};