require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectDb } = require("./config/db");
const { ensureAdmin } = require("./utils/ensureAdmin");
const { seedDefaultTopics } = require("./utils/seedTopics");
const authRoutes = require("./routes/auth");
const topicRoutes = require("./routes/topics");
const gameRoutes = require("./routes/games");
const leaderboardRoutes = require("./routes/leaderboard");
const adminRoutes = require("./routes/admin");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN || "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://localhost:5174",
      "http://127.0.0.1:56722",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 80,
    message: { message: "Too many attempts. Please wait and try again." },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "TypeRider API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDb()
  .then(async () => {
    await ensureAdmin();
    await seedDefaultTopics();
    app.listen(port, "0.0.0.0", () => {
      console.log(`TypeRider API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
