const express = require("express");
const { dashboard } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/admin");

const router = express.Router();

router.get("/dashboard", protectAdmin, dashboard);

module.exports = router;
