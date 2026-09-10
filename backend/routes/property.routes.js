import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Shared SELECT for listing rows (search + all properties)
| Matches the actual properties table directly — no lookup-table joins.
|--------------------------------------------------------------------------
*/
const LISTING_SELECT = `
  SELECT
    p.id,
    p.title AS title_en,
    p.purpose,
    p.price,
    p.currency,
    p.bedrooms,
    p.bathrooms,
    p.status,
    p.featured,
    p.city,
    p.district,
    p.property_type,
    (
      SELECT image_url
      FROM property_images pi
      WHERE pi.property_id = p.id
      ORDER BY pi.id ASC
      LIMIT 1
    ) AS primary_image
  FROM properties p
`;

// Test
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Property Route Working"
  });
});

// Search
router.get("/search", async (req, res) => {
  try {
    const { city, property_type, purpose, min_price, max_price, bedrooms } = req.query;

    let sql = `${LISTING_SELECT} WHERE 1=1`;
    const params = [];

    if (city) {
      sql += " AND p.city LIKE ?";
      params.push(`%${city}%`);
    }
    if (property_type) {
      sql += " AND p.property_type LIKE ?";
      params.push(`%${property_type}%`);
    }
    if (purpose) {
      sql += " AND p.purpose = ?";
      params.push(purpose);
    }
    if (min_price) {
      sql += " AND p.price >= ?";
      params.push(min_price);
    }
    if (max_price) {
      sql += " AND p.price <= ?";
      params.push(max_price);
    }
    if (bedrooms) {
      sql += " AND p.bedrooms >= ?";
      params.push(bedrooms);
    }

    sql += " ORDER BY p.featured DESC, p.id DESC";

    const [properties] = await db.query(sql, params);

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

// All Properties
router.get("/", async (req, res) => {
  try {
    const [properties] = await db.query(
      `${LISTING_SELECT} WHERE p.status = 'available' ORDER BY p.featured DESC, p.id DESC`
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

// Property By ID — full detail page payload
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM properties WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    const property = rows[0];

    const [images] = await db.query(
      `SELECT id, image_url
       FROM property_images
       WHERE property_id = ?
       ORDER BY id ASC`,
      [id]
    );

    // best-effort view count increment — doesn't need to block the response
    db.query("UPDATE properties SET views_count = views_count + 1 WHERE id = ?", [id])
      .catch(() => {});

    res.json({
      success: true,
      property,
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
