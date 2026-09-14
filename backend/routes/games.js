const express = require("express");
const { saveGame, userGames, gameValidators } = require("../controllers/gameController");
const { protect, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", optionalAuth, gameValidators, saveGame);
router.get("/user", protect, userGames);

module.exports = router;
