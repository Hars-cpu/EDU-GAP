import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      validate: {
        validator: (values) =>
          Array.isArray(values) &&
          values.length >= 2 &&
          values.every((value) => typeof value === "string" && value.trim().length > 0),
        message: "Each question must have at least two non-empty options.",
      },
      required: true,
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    selectedAnswer: {
      type: String,
      default: null,
      trim: true,
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

    

    origin: {
      type: String,
      enum: ["chat", "weak_topics"],
      default: "chat",
      required: true,
    },

    questions: {
      type: [questionSchema],
      validate: {
        validator: (values) => Array.isArray(values) && values.length >= 2 && values.length <= 10,
        message: "Quiz must contain between 2 and 10 questions.",
      },
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: 0,
    },

    score: {
      type: Number,
      default: null,
      min: 0,
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

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;