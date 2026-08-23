import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// Signup
export const signup = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      class: userClass,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      class: userClass,
    });
    const token = generateToken(user);

    // Send JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        class: user.class,
      },
    });


  } catch (error) {
    console.error("Signup request failed", {
      error: error.stack,
      body: { ...req.body, password: "[REDACTED]" },
      headers: {
        origin: req.headers.origin,
        contentType: req.headers["content-type"],
        cookie: req.headers.cookie ? "[PRESENT]" : "[ABSENT]",
      },
    });
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

// Current authenticated user
export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      class: req.user.class,
    },
  });
};



// Login
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;


    const user = await User.findOne({ email });


    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );


    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    const token = generateToken(user);


    // Send JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        class: user.class,
      },
    });


  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "Logout successful",
  });
};