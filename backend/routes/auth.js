const express = require("express");
const {
  signup,
  login,
  profile,
  adminLogin,
  signupValidators,
  loginValidators,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signupValidators, signup);
router.post("/login", loginValidators, login);
router.post("/admin/login", adminLogin);
router.get("/profile", protect, profile);

module.exports = router;
