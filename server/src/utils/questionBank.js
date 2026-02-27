const Question = require("../models/Question");
const { questionsSeed } = require("./seedData");

async function synchronizeQuestionBank(options = {}) {
  const { prune = false } = options;
  const operations = questionsSeed.map((question) => ({
    updateOne: {
      filter: {
        stepNumber: question.stepNumber,
        orderInStep: question.orderInStep,
      },
      update: {
        $set: {
          text: question.text,
          pillar: question.pillar,
          traitKey: question.traitKey,
        },
      },
      upsert: true,
    },
  }));

  const result = await Question.bulkWrite(operations, { ordered: true });
  let deletedCount = 0;

  if (prune) {
    const allowedPositions = new Set(
      questionsSeed.map((question) => `${question.stepNumber}:${question.orderInStep}`)
    );
    const existing = await Question.find().select("_id stepNumber orderInStep").lean();
    const idsToDelete = existing
      .filter(
        (question) => !allowedPositions.has(`${question.stepNumber}:${question.orderInStep}`)
      )
      .map((question) => question._id);

    if (idsToDelete.length > 0) {
      const deleteResult = await Question.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount = deleteResult.deletedCount || 0;
    }
  }

  return {
    expectedCount: questionsSeed.length,
    upsertedCount: result.upsertedCount || 0,
    modifiedCount: result.modifiedCount || 0,
    matchedCount: result.matchedCount || 0,
    deletedCount,
  };
}

module.exports = {
  synchronizeQuestionBank,
};
