const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Admin = require("../models/Admin");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    country: user.country,
    countryCode: user.countryCode,
    bestWpm: user.bestWpm,
    bestAccuracy: user.bestAccuracy,
    totalGames: user.totalGames,
    totalWins: user.totalWins,
    totalLosses: user.totalLosses,
    averageWpm: user.totalGames ? Math.round(user.wpmSum / user.totalGames) : 0,
    winRate: user.totalGames
      ? Math.round((user.totalWins / user.totalGames) * 100)
      : 0,
  };
}

const signupValidators = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters."),
  body("email").isEmail().withMessage("Enter a valid email."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
  body("country").trim().notEmpty().withMessage("Select a country."),
];

const loginValidators = [
  body("email").isEmail().withMessage("Enter a valid email."),
  body("password").notEmpty().withMessage("Password is required."),
];

async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, country, countryCode } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      country,
      countryCode: countryCode || "",
    });

    const token = signToken({ id: user._id, role: "user" });
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken({ id: user._id, role: "user" });
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
}

async function profile(req, res) {
  res.json({ user: formatUser(req.user) });
}

async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const token = signToken({ id: admin._id, role: "admin" });
    res.json({
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  profile,
  adminLogin,
  signupValidators,
  loginValidators,
  formatUser,
};
