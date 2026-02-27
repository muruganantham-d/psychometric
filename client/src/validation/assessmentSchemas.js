import { z } from "zod";

export const stepSubmissionSchema = z.object({
  stepNumber: z.number().int().min(1).max(11),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        value: z.number().int().min(1).max(5),
      })
    )
    .min(1),
});
