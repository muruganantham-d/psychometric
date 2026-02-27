const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 11,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
