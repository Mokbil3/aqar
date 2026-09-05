import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/db.js";
``
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS current_time");

    res.json({
      success: true,
      message: "Aqar API Running",
      time: rows[0].current_time
    });
catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    error: error.message || String(error),
    stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
  });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
``
