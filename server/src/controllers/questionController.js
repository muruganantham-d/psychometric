const Question = require("../models/Question");
const { HttpError } = require("../utils/httpError");
const { sendSuccess } = require("../utils/response");
const { synchronizeQuestionBank } = require("../utils/questionBank");
const { stepQuerySchema } = require("../validators/questionValidators");

async function getQuestionsByStep(req, res) {
  const { step } = stepQuerySchema.parse(req.query);

  let questions = await Question.find({ stepNumber: step })
    .sort({ orderInStep: 1 })
    .select("_id text pillar traitKey stepNumber orderInStep")
    .lean();

  if (questions.length === 0) {
    await synchronizeQuestionBank();
    questions = await Question.find({ stepNumber: step })
      .sort({ orderInStep: 1 })
      .select("_id text pillar traitKey stepNumber orderInStep")
      .lean();
  }

  if (questions.length === 0) {
    throw new HttpError(404, `No questions found for step ${step}.`);
  }

  return sendSuccess(res, {
    stepNumber: step,
    totalSteps: 11,
    questions,
  });
}

module.exports = {
  getQuestionsByStep,
};
