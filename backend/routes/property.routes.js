import express from "express";
import db from "../config/db.js";

const router = express.Router();

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
    const { city, country, property_type } = req.query;

    let sql = "SELECT * FROM properties WHERE 1=1";
    const params = [];

    if (city) {
      sql += " AND city = ?";
      params.push(city);
    }

    if (country) {
      sql += " AND country = ?";
      params.push(country);
    }

    if (property_type) {
      sql += " AND property_type = ?";
      params.push(property_type);
    }

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
      "SELECT * FROM properties ORDER BY id DESC"
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

// Property By ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM properties WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.json({
      success: true,
      property: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
