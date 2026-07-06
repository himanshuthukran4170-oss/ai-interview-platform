const express=require("express");
const router =express.Router();

const protect = require("../middleware/authMiddleware");
const aiLimiter=require("../middleware/rateLimiter");
const {
    generateQuestions,
    evaluateAnswers,
    getInterviewHistory,
    getInterviewStats,
  } = require("../controllers/interviewController");
router.post(
    "/generate",
    protect,
    aiLimiter,
    generateQuestions
);
router.post(
    "/evaluate",
    protect,
    aiLimiter,
    evaluateAnswers
);
router.get(
    "/history",
    protect,
    getInterviewHistory
);
router.get(
    "/stats",
    protect,
    getInterviewStats
);
module.exports=router;