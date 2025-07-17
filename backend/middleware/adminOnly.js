const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  try {
    // 🔐 Extract token from Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    // 🔍 Decode and verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // ❌ Block non-admin users
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = user; // ✅ Attach user to request for later use
    next(); // 🔁 Proceed
  } catch (err) {
    console.error("Admin Middleware Error:", err.message);
    return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
  }
};

module.exports = adminOnly;
