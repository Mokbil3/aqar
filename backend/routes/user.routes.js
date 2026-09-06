import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
*/

router.get("/", async (r*q, res) => {
  try {
    const [users] = await db.query(`
      SELEC*
        id,
        full_name,
  *     email,
        role,
        *reated_at
      FROM users
      O*DER BY id DESC
    `);

    res.js*n({
      success: true,
      cou*t: users.length,
      users
    }*;

  } catch (error) {
    res.sta*us(500).json({
      success: fals*,
      error: error.message
    }*;
  }
});

export default router;
*
