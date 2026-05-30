const express=require("express");
const router =express.Router();

const {
    generateQuestions,
    evaluateAnswers,
    getInterviewHistory,
    getInterviewStats,
  } = require("../controllers/interviewController");
router.post(
    "/generate",
    generateQuestions
);
router.post(
    "/evaluate",
    evaluateAnswers
);
router.get(
    "/history/:userId",
    getInterviewHistory
);
router.get(
    "/stats/:userId",
    getInterviewStats
);
module.exports=router;