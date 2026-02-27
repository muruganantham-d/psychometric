const express = require("express");
const {
  createSession,
  getSession,
  updateCurrentStep,
  submitAnswers,
  completeSession,
  getSessionResults,
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", createSession);
router.get("/:id", getSession);
router.patch("/:id/step", updateCurrentStep);
router.post("/:id/answers", submitAnswers);
router.post("/:id/complete", completeSession);
router.get("/:id/results", getSessionResults);

module.exports = router;
