const express=require("express");
const router =express.Router();

const protect = require("../middleware/authMiddleware");

const {
    generateQuestions,
    evaluateAnswers,
    getInterviewHistory,
    getInterviewStats,
  } = require("../controllers/interviewController");
router.post(
    "/generate",
    protect,
    generateQuestions
);
router.post(
    "/evaluate",
    protect,
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