const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function protectAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Admin login required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only." });
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin account not found." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Admin session expired. Please log in again." });
  }
}

module.exports = { protectAdmin };
