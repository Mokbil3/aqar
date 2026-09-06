import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id,
        full_name,
        email,
        role,
        created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
