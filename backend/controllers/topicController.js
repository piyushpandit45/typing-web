const { body, validationResult } = require("express-validator");
const Topic = require("../models/Topic");

const topicValidators = [
  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 characters."),
  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be easy, medium, or hard."),
  body("content")
    .trim()
    .isLength({ min: 80 })
    .withMessage("Typing content must be at least 80 characters."),
];

async function listTopics(req, res, next) {
  try {
    const { difficulty, active } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const topics = await Topic.find(filter).sort({ createdAt: -1 });
    res.json({ topics });
  } catch (error) {
    next(error);
  }
}

async function randomTopic(req, res, next) {
  try {
    const difficulty = req.params.difficulty;
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty." });
    }

    const excludeRaw = req.query.exclude || "";
    const exclude = excludeRaw
      .split(",")
      .map((id) => id.trim())
      .filter((id) => /^[a-fA-F0-9]{24}$/.test(id));

    const filter = { difficulty, isActive: true };
    if (exclude.length) {
      filter._id = { $nin: exclude };
    }

    let topics = await Topic.find(filter);
    if (!topics.length && exclude.length) {
      topics = await Topic.find({ difficulty, isActive: true });
    }

    if (!topics.length) {
      return res.status(404).json({ message: "No topics available for this difficulty." });
    }

    const topic = topics[Math.floor(Math.random() * topics.length)];
    res.json({ topic });
  } catch (error) {
    next(error);
  }
}

async function createTopic(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const topic = await Topic.create({
      title: req.body.title,
      difficulty: req.body.difficulty,
      content: req.body.content.trim(),
      isActive: req.body.isActive !== false,
    });

    res.status(201).json({ topic });
  } catch (error) {
    next(error);
  }
}

async function updateTopic(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        difficulty: req.body.difficulty,
        content: req.body.content.trim(),
        isActive: req.body.isActive,
      },
      { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    res.json({ topic });
  } catch (error) {
    next(error);
  }
}

async function deleteTopic(req, res, next) {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }
    res.json({ message: "Topic deleted." });
  } catch (error) {
    next(error);
  }
}

async function toggleTopicStatus(req, res, next) {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    if (typeof req.body.isActive === "boolean") {
      topic.isActive = req.body.isActive;
    } else {
      topic.isActive = !topic.isActive;
    }

    await topic.save();
    res.json({ topic });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTopics,
  randomTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  toggleTopicStatus,
  topicValidators,
};
