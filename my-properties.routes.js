import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = 1;

    const [properties] = await db.query(
      "SELECT * FROM properties WHERE user_id = ?",
      [userId]
    );

    res.json({
      success: true,
      count: properties.length,
      properties
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
