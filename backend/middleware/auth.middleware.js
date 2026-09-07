import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| requireAuth
| Checks for a "Bearer <token>" Authorization header, verifies it, and
| attaches the decoded user info to req.user. Routes that need a logged-in
| user (like creating a property) use this before their handler runs.
|--------------------------------------------------------------------------
*/
export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in to do this"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session has expired — please log in again"
    });
  }
}
