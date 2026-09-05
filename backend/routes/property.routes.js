import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Property Route Working"
  });
});

// Get All Properties
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

// Create Sample Property
router.get("/create-sample", async (req, res) => {
  try {
    await db.query(
      `INSERT INTO properties
      (title, description, price, country, city, property_type, bedrooms, bathrooms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Luxury Villa",
        "Beautiful villa in Dubai",
        3500000,
        "UAE",
        "Dubai",
        "Villa",
        5,
        6
      ]
    );

    res.json({
      success: true,
      message: "Sample property created"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
