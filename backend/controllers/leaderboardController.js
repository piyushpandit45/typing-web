const GameResult = require("../models/GameResult");

async function getLeaderboard(req, res, next) {
  try {
    const { period = "all", difficulty = "all" } = req.query;
    const match = { isOfficial: true };

    if (["easy", "medium", "hard"].includes(difficulty)) {
      match.difficulty = difficulty;
    }

    const now = new Date();
    if (period === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      match.createdAt = { $gte: start };
    } else if (period === "weekly") {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      match.createdAt = { $gte: start };
    }

    const rows = await GameResult.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$user",
          playerName: { $first: "$playerName" },
          country: { $first: "$country" },
          countryCode: { $first: "$countryCode" },
          bestWpm: { $max: "$wpm" },
          bestAccuracy: { $max: "$accuracy" },
          wins: {
            $sum: { $cond: [{ $eq: ["$result", "win"] }, 1, 0] },
          },
          games: { $sum: 1 },
          lastDifficulty: { $first: "$difficulty" },
        },
      },
      { $sort: { bestWpm: -1, bestAccuracy: -1, wins: -1 } },
      { $limit: 50 },
    ]);

    const leaderboard = rows.map((row, index) => ({
      rank: index + 1,
      userId: row._id,
      playerName: row.playerName,
      country: row.country,
      countryCode: row.countryCode,
      bestWpm: row.bestWpm,
      accuracy: row.bestAccuracy,
      difficulty: row.lastDifficulty,
      wins: row.wins,
      games: row.games,
    }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLeaderboard };
