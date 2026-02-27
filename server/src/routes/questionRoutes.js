const express = require("express");
const { getQuestionsByStep } = require("../controllers/questionController");

const router = express.Router();

router.get("/", getQuestionsByStep);

module.exports = router;
