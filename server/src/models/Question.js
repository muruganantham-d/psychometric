const mongoose = require("mongoose");
const { ALL_TRAIT_KEYS } = require("../utils/traits");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    pillar: {
      type: String,
      enum: ["interest", "personality", "values", "strengths"],
      required: true,
    },
    traitKey: {
      type: String,
      enum: ALL_TRAIT_KEYS,
      required: true,
    },
    stepNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 11,
      index: true,
    },
    orderInStep: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ stepNumber: 1, orderInStep: 1 }, { unique: true });

module.exports = mongoose.model("Question", questionSchema);
