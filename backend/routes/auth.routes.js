import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.json({
    success: true,
    message: "Register endpoint"
  });
});

router.post("/login", (req, res) => {
  res.json({
    success: true,
    message: "Login endpoint"
  });
});

export default router;
