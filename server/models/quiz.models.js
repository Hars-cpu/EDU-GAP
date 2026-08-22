import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: String,

    options: [String],

    correctAnswer: String,

    selectedAnswer: {
      type: String,
      default: null,
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sourceTitle: {
      type: String,
      default: null,
    },

    origin: {
      type: String,
      enum: ["chat", "weak_topics"],
    },

   

    questions: [questionSchema],

    totalQuestions: Number,

    score: {
      type: Number,
      default: null,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weakTopics: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);