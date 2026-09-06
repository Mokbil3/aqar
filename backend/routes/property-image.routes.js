import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Add Image To Property
router.get("/add", async (req, res) => {
  try {
    await db.query(
      `
      INSERT INTO property_images
      (property_id, image_url)
      VALUES (?, ?)
      `,
      [
        1,
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
      ]
    );

    res.json({
      success: true,
      message: "Property image added"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Images
router.get("/", async (req, res) => {
  try {
    const [images] = await db.query(`
      SELECT *
      FROM property_images
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      count: images.length,
      images
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
