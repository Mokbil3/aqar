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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET PROPERTY BY ID
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      country,
      city,
      property_type,
      bedrooms,
      bathrooms
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO properties
      (
        title,
        description,
        price,
        country,
        city,
        property_type,
        bedrooms,
        bathrooms
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        price,
        country,
        city,
        property_type,
        bedrooms,
        bathrooms
      ]
    );

    res.status(201).json({
      success: true,
      propertyId: result.insertId,
      message: "Property created successfully"
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
| UPDATE PROPERTY
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      price
    } = req.body;

    await db.query(
      `
      UPDATE properties
      SET
        title = ?,
        description = ?,
        price = ?
      WHERE id = ?
      `,
      [
        title,
        description,
        price,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: "Property updated successfully"
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
| DELETE PROPERTY
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM properties WHERE id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
