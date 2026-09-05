import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import db from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      message: "Aqar API Running",
      database: "Connected"
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
| USERS TABLE
|--------------------------------------------------------------------------
*/

app.get("/create-users-table", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','agent','owner','buyer') DEFAULT 'buyer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({
      success: true,
      message: "Users table created successfully"
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
| PROPERTIES TABLE
|--------------------------------------------------------------------------
*/

app.get("/create-properties-table", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NULL,

        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NULL,
        title_en VARCHAR(255) NULL,

        description TEXT,
        description_ar TEXT NULL,
        description_en TEXT NULL,

        price DECIMAL(15,2) NOT NULL,

        country VARCHAR(100),
        city VARCHAR(100),

        property_type VARCHAR(100),

        listing_type ENUM('sale','rent') DEFAULT 'sale',
        status ENUM('active','sold','rented') DEFAULT 'active',

        bedrooms INT DEFAULT 0,
        bathrooms INT DEFAULT 0,

        area DECIMAL(10,2) DEFAULT 0,

        latitude DECIMAL(10,8) NULL,
        longitude DECIMAL(11,8) NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({
      success: true,
      message: "Properties table created successfully"
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
| PROPERTY IMAGES TABLE
|--------------------------------------------------------------------------
*/

app.get("/create-property-images-table", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        property_id BIGINT NOT NULL,
        image_url VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({
      success: true,
      message: "Property images table created"
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
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
