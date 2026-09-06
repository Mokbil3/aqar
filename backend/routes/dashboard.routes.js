import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [[users]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [[properties]] = await db.query(
      "SELECT COUNT(*) AS total_properties FROM properties"
    );

    const [[favorites]] = await db.query(
      "SELECT COUNT(*) AS total_favorites FROM favorites"
    );

    res.json({
      success: true,
      stats: {
        total_users: users.total_users,
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
