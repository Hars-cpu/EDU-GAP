import mongoose from "mongoose";

const recentQuizSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },

    topics: [String],

    score: Number,

    totalQuestions: Number,

    takenAt: Date,
  },
  { _id: false }
);

const studentAnalyticsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    recentQuizzes: {
      type: [recentQuizSchema],
      default: [],
    },

    overallProgressSummary: {
      type: String,
      default: "",
    },

    weakTopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentAnalytics",
  studentAnalyticsSchema
);