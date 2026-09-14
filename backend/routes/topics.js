const express = require("express");
const {
  listTopics,
  randomTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  toggleTopicStatus,
  topicValidators,
} = require("../controllers/topicController");
const { protectAdmin } = require("../middleware/admin");

const router = express.Router();

router.get("/", listTopics);
router.get("/random/:difficulty", randomTopic);
router.post("/", protectAdmin, topicValidators, createTopic);
router.put("/:id", protectAdmin, topicValidators, updateTopic);
router.delete("/:id", protectAdmin, deleteTopic);
router.patch("/:id/status", protectAdmin, toggleTopicStatus);

module.exports = router;
