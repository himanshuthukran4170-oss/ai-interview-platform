const express = require("express");

const router = express.Router();

const {
  analyzeResume,
} = require("../controllers/resumeController");

const upload = require("../middleware/uploadMiddleware");

router.post(
  "/analyze",
  upload.single("resume"),
  analyzeResume
);

module.exports = router;