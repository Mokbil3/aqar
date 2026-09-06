import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADD FAVORITE
|--------------------------------------------------------------------------
*/

router.get("/add", async (req, res) => {
  try {
    await db.query(
      `
      INSERT INTO favorites
      (user_id, property_id)
      VALUES (?, ?)
      `,
      [1, 1]
    );

    res.json({
      success: true,
      message: "Property added to favorites"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET FAVORITES
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [favorites] = await db.query(`
      SELECT
        f.id,
        p.title,
        p.price,
        p.city,
        p.country
      FROM favorites f
      JOIN properties p
        ON p.id = f.property_id
      ORDER BY f.id DESC
    `);

    res.json({
      success: true,
      count: favorites.length,
      favorites
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
