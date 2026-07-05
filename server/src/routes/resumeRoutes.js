const express = require("express");

const router = express.Router();

const {
  analyzeResume,
  matchResume
} = require("../controllers/resumeController");

const upload = require("../middleware/uploadMiddleware");
const protect= require("../middleware/authMiddleware");
router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);
router.post(
  "/match",
  protect,
  upload.single("resume"),
  matchResume
);

module.exports = router;