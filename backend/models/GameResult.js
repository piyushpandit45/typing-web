const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    guestName: { type: String, default: "" },
    playerName: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    countryCode: { type: String, default: "" },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", default: null },
    topicName: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    correctChars: { type: Number, required: true },
    incorrectChars: { type: Number, required: true },
    maxStreak: { type: Number, required: true },
    playerProgress: { type: Number, required: true },
    opponentProgress: { type: Number, required: true },
    requiredWpm: { type: Number, required: true },
    result: { type: String, required: true, enum: ["win", "loss", "draw"] },
    isOfficial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

gameResultSchema.index({ createdAt: -1 });
gameResultSchema.index({ wpm: -1 });
gameResultSchema.index({ difficulty: 1, wpm: -1 });
gameResultSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("GameResult", gameResultSchema);
