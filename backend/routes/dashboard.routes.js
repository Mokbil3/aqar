import express from "express";
import db from "../config/db.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [[properties]] = await db.query(
      "SELECT COUNT(*) AS total_properties FROM properties WHERE user_id = ?",
      [userId]
    );

    const [[favorites]] = await db.query(
      "SELECT COUNT(*) AS total_favorites FROM favorites WHERE user_id = ?",
      [userId]
    );

    res.json({
      success: true,
      stats: {
        total_properties: properties.total_properties,
        total_favorites: favorites.total_favorites
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
