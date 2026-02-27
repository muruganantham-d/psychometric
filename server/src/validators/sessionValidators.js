const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid session id.");

const sessionIdParamSchema = z.object({
  id: objectIdSchema,
});

const updateStepSchema = z.object({
  currentStep: z.number().int().min(1).max(11),
});

const submitAnswersSchema = z.object({
  stepNumber: z.number().int().min(1).max(11),
  answers: z
    .array(
      z.object({
        questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid question id."),
        value: z.number().int().min(1).max(5),
      })
    )
    .min(1),
});

module.exports = {
  sessionIdParamSchema,
  updateStepSchema,
  submitAnswersSchema,
};
