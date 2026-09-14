const { body, validationResult } = require("express-validator");
const GameResult = require("../models/GameResult");
const User = require("../models/User");
const { formatUser } = require("./authController");

const WPM_REQUIREMENTS = {
  easy: 25,
  medium: 40,
  hard: 60,
};

const gameValidators = [
  body("playerName").trim().isLength({ min: 2, max: 60 }).withMessage("Enter a valid player name."),
  body("country").trim().notEmpty().withMessage("Country is required."),
  body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty."),
  body("topicName").trim().notEmpty().withMessage("Topic is required."),
  body("wpm").isFloat({ min: 0, max: 400 }).withMessage("Invalid WPM."),
  body("accuracy").isFloat({ min: 0, max: 100 }).withMessage("Invalid accuracy."),
  body("correctChars").isInt({ min: 0 }).withMessage("Invalid correct character count."),
  body("incorrectChars").isInt({ min: 0 }).withMessage("Invalid incorrect character count."),
  body("maxStreak").isInt({ min: 0 }).withMessage("Invalid streak."),
  body("requiredWpm").isFloat({ min: 0 }).withMessage("Invalid required WPM."),
  body("result").isIn(["win", "loss", "draw"]).withMessage("Invalid result."),
];

async function saveGame(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Validate result based on WPM requirements
    const requiredWpm = WPM_REQUIREMENTS[req.body.difficulty] || 0;
    const expectedResult = req.body.wpm >= requiredWpm ? "win" : "loss";
    
    // Ensure the result matches the WPM-based calculation
    if (req.body.result !== expectedResult) {
      req.body.result = expectedResult;
    }

    const isOfficial = Boolean(req.authId);
    const payload = {
      user: req.authId || null,
      guestName: isOfficial ? "" : req.body.playerName,
      playerName: req.body.playerName,
      country: req.body.country,
      countryCode: req.body.countryCode || "",
      difficulty: req.body.difficulty,
      topic: req.body.topicId || null,
      topicName: req.body.topicName,
      wpm: Math.round(req.body.wpm),
      accuracy: Math.round(req.body.accuracy * 10) / 10,
      correctChars: req.body.correctChars,
      incorrectChars: req.body.incorrectChars,
      maxStreak: req.body.maxStreak,
      playerProgress: req.body.playerProgress ?? 0,
      opponentProgress: req.body.opponentProgress ?? 0,
      requiredWpm: requiredWpm,
      result: req.body.result,
      isOfficial,
    };

    const game = await GameResult.create(payload);

    let user = null;
    if (req.authId) {
      user = await User.findById(req.authId);
      if (user) {
        user.totalGames += 1;
        user.wpmSum += game.wpm;
        if (game.result === "win") user.totalWins += 1;
        if (game.result === "loss") user.totalLosses += 1;
        if (game.wpm > user.bestWpm) user.bestWpm = game.wpm;
        if (game.accuracy > user.bestAccuracy) user.bestAccuracy = game.accuracy;
        await user.save();
      }
    }

    res.status(201).json({
      game,
      user: user ? formatUser(user) : null,
    });
  } catch (error) {
    next(error);
  }
}

async function userGames(req, res, next) {
  try {
    const games = await GameResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ games });
  } catch (error) {
    next(error);
  }
}

module.exports = { saveGame, userGames, gameValidators };
