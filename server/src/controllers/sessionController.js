const Session = require("../models/Session");
const Question = require("../models/Question");
const Career = require("../models/Career");
const { computeAssessmentResults } = require("../services/scoringService");
const { HttpError } = require("../utils/httpError");
const { synchronizeQuestionBank } = require("../utils/questionBank");
const { sendSuccess } = require("../utils/response");
const {
  sessionIdParamSchema,
  updateStepSchema,
  submitAnswersSchema,
} = require("../validators/sessionValidators");

async function findSessionOrThrow(sessionId) {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new HttpError(404, "Session not found.");
  }

  return session;
}

function answersToMap(answers) {
  return new Map(answers.map((answer) => [answer.questionId.toString(), answer.value]));
}

async function createSession(req, res) {
  const session = await Session.create({
    currentStep: 1,
    answers: [],
  });

  return sendSuccess(
    res,
    {
      sessionId: session._id.toString(),
      currentStep: session.currentStep,
    },
    201
  );
}

async function getSession(req, res) {
  const { id } = sessionIdParamSchema.parse(req.params);
  const session = await findSessionOrThrow(id);

  return sendSuccess(res, {
    sessionId: session._id.toString(),
    currentStep: session.currentStep,
    completedAt: session.completedAt,
    answers: session.answers.map((answer) => ({
      questionId: answer.questionId.toString(),
      value: answer.value,
    })),
  });
}

async function updateCurrentStep(req, res) {
  const { id } = sessionIdParamSchema.parse(req.params);
  const { currentStep } = updateStepSchema.parse(req.body);

  const session = await findSessionOrThrow(id);
  session.currentStep = currentStep;
  await session.save();

  return sendSuccess(res, {
    sessionId: session._id.toString(),
    currentStep: session.currentStep,
  });
}

async function submitAnswers(req, res) {
  const { id } = sessionIdParamSchema.parse(req.params);
  const { stepNumber, answers } = submitAnswersSchema.parse(req.body);
  const session = await findSessionOrThrow(id);

  let stepQuestions = await Question.find({ stepNumber })
    .select("_id")
    .sort({ orderInStep: 1 })
    .lean();

  if (stepQuestions.length === 0) {
    await synchronizeQuestionBank();
    stepQuestions = await Question.find({ stepNumber })
      .select("_id")
      .sort({ orderInStep: 1 })
      .lean();
  }

  if (stepQuestions.length === 0) {
    throw new HttpError(404, `No questions configured for step ${stepNumber}.`);
  }

  const stepQuestionIds = stepQuestions.map((question) => question._id.toString());
  const stepQuestionIdSet = new Set(stepQuestionIds);
  const providedIds = answers.map((answer) => answer.questionId);
  const providedIdSet = new Set(providedIds);

  if (providedIdSet.size !== providedIds.length) {
    throw new HttpError(400, "Duplicate questionId values are not allowed.");
  }

  for (const questionId of providedIds) {
    if (!stepQuestionIdSet.has(questionId)) {
      throw new HttpError(400, `Question ${questionId} does not belong to step ${stepNumber}.`);
    }
  }

  if (
    answers.length !== stepQuestionIds.length ||
    stepQuestionIds.some((questionId) => !providedIdSet.has(questionId))
  ) {
    throw new HttpError(400, "All questions in this step must be answered.");
  }

  // Upsert by question id so revisiting a step overwrites only that step's responses.
  const mergedAnswers = answersToMap(session.answers);
  for (const answer of answers) {
    mergedAnswers.set(answer.questionId, answer.value);
  }

  session.answers = Array.from(mergedAnswers.entries()).map(([questionId, value]) => ({
    questionId,
    value,
  }));
  session.currentStep = Math.max(session.currentStep, Math.min(stepNumber + 1, 11));
  await session.save();

  return sendSuccess(res, {
    savedCount: answers.length,
    currentStep: session.currentStep,
  });
}

async function completeSession(req, res) {
  const { id } = sessionIdParamSchema.parse(req.params);
  const session = await findSessionOrThrow(id);

  const questions = await Question.find()
    .select("_id pillar traitKey")
    .sort({ stepNumber: 1, orderInStep: 1 })
    .lean();
  if (questions.length === 0) {
    throw new HttpError(404, "No assessment questions found. Run the seed script first.");
  }

  const answersByQuestionId = answersToMap(session.answers);
  const missingQuestions = questions.filter((question) => !answersByQuestionId.has(question._id.toString()));
  if (missingQuestions.length > 0) {
    throw new HttpError(400, "Assessment is not complete yet.", {
      missingQuestionCount: missingQuestions.length,
    });
  }

  const careers = await Career.find().lean();
  if (careers.length === 0) {
    throw new HttpError(404, "No careers found. Run the seed script first.");
  }

  const results = computeAssessmentResults({
    questions,
    answersByQuestionId,
    careers,
  });

  session.results = results;
  session.completedAt = new Date();
  session.currentStep = 11;
  await session.save();

  return sendSuccess(res, {
    completedAt: session.completedAt,
    results,
  });
}

async function getSessionResults(req, res) {
  const { id } = sessionIdParamSchema.parse(req.params);
  const session = await findSessionOrThrow(id);

  if (session.results) {
    return sendSuccess(res, {
      results: session.results,
    });
  }

  const questions = await Question.find()
    .select("_id pillar traitKey")
    .sort({ stepNumber: 1, orderInStep: 1 })
    .lean();
  const answersByQuestionId = answersToMap(session.answers);

  if (questions.some((question) => !answersByQuestionId.has(question._id.toString()))) {
    throw new HttpError(400, "Assessment results are not available until all questions are answered.");
  }

  const careers = await Career.find().lean();
  if (careers.length === 0) {
    throw new HttpError(404, "No careers found. Run the seed script first.");
  }

  const results = computeAssessmentResults({
    questions,
    answersByQuestionId,
    careers,
  });

  session.results = results;
  session.completedAt = session.completedAt || new Date();
  await session.save();

  return sendSuccess(res, {
    results: session.results,
  });
}

module.exports = {
  createSession,
  getSession,
  updateCurrentStep,
  submitAnswers,
  completeSession,
  getSessionResults,
};
