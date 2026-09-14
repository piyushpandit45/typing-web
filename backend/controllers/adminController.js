const User = require("../models/User");
const Topic = require("../models/Topic");
const GameResult = require("../models/GameResult");

async function dashboard(req, res, next) {
  try {
    const [
      totalUsers,
      totalGames,
      totalTopics,
      easyTopics,
      mediumTopics,
      hardTopics,
      recentGames,
    ] = await Promise.all([
      User.countDocuments(),
      GameResult.countDocuments(),
      Topic.countDocuments(),
      Topic.countDocuments({ difficulty: "easy" }),
      Topic.countDocuments({ difficulty: "medium" }),
      Topic.countDocuments({ difficulty: "hard" }),
      GameResult.find().sort({ createdAt: -1 }).limit(12),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalGames,
        totalTopics,
        easyTopics,
        mediumTopics,
        hardTopics,
      },
      recentGames,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { dashboard };
