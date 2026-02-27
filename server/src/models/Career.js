const mongoose = require("mongoose");
const {
  INTEREST_TRAITS,
  PERSONALITY_TRAITS,
  STRENGTH_TRAITS,
  VALUE_TRAITS,
} = require("../utils/traits");

const createTraitShape = (traitKeys) =>
  traitKeys.reduce((shape, traitKey) => {
    shape[traitKey] = {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    };
    return shape;
  }, {});

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    salaryRange: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      required: true,
      trim: true,
    },
    growthOutlook: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    traitProfile: {
      interest: createTraitShape(INTEREST_TRAITS),
      personality: createTraitShape(PERSONALITY_TRAITS),
      strengths: createTraitShape(STRENGTH_TRAITS),
      values: createTraitShape(VALUE_TRAITS),
    },
  },
  { timestamps: true }
);

careerSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model("Career", careerSchema);
