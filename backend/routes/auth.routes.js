import express from "express";

const router = express.Router();

/*
  Test Route
  GET /api/auth/test
*/

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working"
  });
});

export default router;
