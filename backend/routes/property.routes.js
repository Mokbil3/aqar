import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Property Route Working"
  });
});

/*
|--------------------------------------------------------------------------
| SEARCH PROPERTIES
|--------------------------------------------------------------------------
*/

router.get("/search", async (req, res) => {
  try {
    const { city, country, property_type } = req.query;

    let sql = `
      SELECT *
      FROM properties
      WHERE 1=1
    `;

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

    sql += " ORDER BY id DESC";

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

/*
|--------------------------------------------------------------------------
| GET ALL PROPERTIES
|--------------------------------------------------------------------------
*/

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

  } catch 
