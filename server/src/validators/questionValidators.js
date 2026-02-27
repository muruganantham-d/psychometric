const { z } = require("zod");

const stepQuerySchema = z.object({
  step: z.coerce.number().int().min(1).max(11),
});

module.exports = {
  stepQuerySchema,
};
