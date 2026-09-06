import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Shared SELECT for listing rows (search + all properties)
| Keeps a light payload: enough to render a property card.
|--------------------------------------------------------------------------
*/
const LISTING_SELECT = `
  SELECT
    p.id,
    p.title_en,
    p.title_ar,
    p.slug_en,
    p.purpose,
    p.price,
    p.currency,
    p.bedrooms,
    p.bathrooms,
    p.area,
    p.status,
    p.featured,
    c.name_en AS city,
    d.name_en AS district,
    pt.name_en AS property_type,
    (
      SELECT image_url
      FROM property_images pi
      WHERE pi.property_id = p.id
      ORDER BY pi.is_primary DESC, pi.sort_order ASC
      LIMIT 1
    ) AS primary_image
  FROM properties p
  JOIN cities c ON c.id = p.city_id
  JOIN districts d ON d.id = p.district_id
  JOIN property_types pt ON pt.id = p.property_type_id
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
      sql += " AND c.name_en LIKE ?";
      params.push(`%${city}%`);
    }
    if (property_type) {
      sql += " AND pt.name_en LIKE ?";
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
      `
      SELECT
        p.*,
        co.name_en AS country,
        s.name_en AS state,
        c.name_en AS city,
        d.name_en AS district,
        n.name_en AS neighborhood,
        pt.name_en AS property_type,
        u.first_name AS agent_first_name,
        u.last_name AS agent_last_name,
        u.avatar AS agent_avatar,
        u.phone AS agent_phone,
        u.email AS agent_email,
        ag.whatsapp AS agent_whatsapp
      FROM properties p
      JOIN countries co ON co.id = p.country_id
      JOIN states s ON s.id = p.state_id
      JOIN cities c ON c.id = p.city_id
      JOIN districts d ON d.id = p.district_id
      JOIN neighborhoods n ON n.id = p.neighborhood_id
      JOIN property_types pt ON pt.id = p.property_type_id
      LEFT JOIN agents ag ON ag.id = p.agent_id
      LEFT JOIN users u ON u.id = ag.user_id
      WHERE p.id = ?
      `,
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
      `SELECT id, image_url, alt_text_en, is_primary, sort_order
       FROM property_images
       WHERE property_id = ?
       ORDER BY is_primary DESC, sort_order ASC`,
      [id]
    );

    const [features] = await db.query(
      `SELECT f.id, f.name_en, f.name_ar, f.icon_class
       FROM property_features pf
       JOIN features f ON f.id = pf.feature_id
       WHERE pf.property_id = ?`,
      [id]
    );

    // best-effort view count increment — doesn't need to block the response
    db.query("UPDATE properties SET views_count = views_count + 1 WHERE id = ?", [id])
      .catch(() => {});

    res.json({
      success: true,
      property,
      images,
      features
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
