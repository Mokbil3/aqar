import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working"
  });
});

// Register Page Test
router.get("/register", (req, res) => {
  res.json({
    success: true,
    message: "Register endpoint is available. Use POST to register."
  });
});

// Create Test User
router.get("/create-test-user", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await db.query(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [
        "Admin User",
        `admin${Date.now()}@aqar.com`,
        hashedPassword
      ]
    );

    res.json({
      success: true,
      message: "Test user created"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Login Page Test
router.get("/login", (req, res) => {
  res.json({
    success: true,
    message: "Login endpoint is available. Use POST to login."
  });
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
