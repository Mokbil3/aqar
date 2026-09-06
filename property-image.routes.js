import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Add Image To Property
| Changed from GET to POST: a GET request should never modify data — it
| can be triggered by a link click, a bot crawling the site, or a browser
| prefetch, all of which would silently insert rows.
| Body: { property_id, image_url, is_primary?, alt_text_en? }
|--------------------------------------------------------------------------
*/
router.post("/add", async (req, res) => {
  try {
    const { property_id, image_url, is_primary, alt_text_en } = req.body;

    if (!property_id || !image_url) {
      return res.status(400).json({
        success: false,
        message: "property_id and image_url are required"
      });
    }

    await db.query(
      `
      INSERT INTO property_images
      (property_id, image_url, is_primary, alt_text_en)
      VALUES (?, ?, ?, ?)
      `,
      [property_id, image_url, Boolean(is_primary), alt_text_en || null]
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

// Get All Images (across every property — mainly for admin/debugging use)
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

// Get Images For One Property — what property.js will actually call
router.get("/:property_id", async (req, res) => {
  try {
    const [images] = await db.query(
      `SELECT id, image_url, alt_text_en, is_primary, sort_order
       FROM property_images
       WHERE property_id = ?
       ORDER BY is_primary DESC, sort_order ASC`,
      [req.params.property_id]
    );

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
