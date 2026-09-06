import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import favoriteRoutes from "./routes/favorite.routes.js";
import db from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import propertyImageRoutes from "./routes/property-image.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
| NOTE: table creation is no longer done through the API. Run
| database/schema.sql directly against MySQL once (mysql CLI, TablePlus,
| MySQL Workbench, etc.) to set up every table. Keeping schema changes in
| one SQL file, instead of scattered GET routes, means the database
| structure lives in one place and isn't at risk of being triggered
| accidentally by a browser, bot, or link click.
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
| API ROUTES
|--------------------------------------------------------------------------
*/
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/property-images", propertyImageRoutes);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
