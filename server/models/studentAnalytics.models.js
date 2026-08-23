import mongoose from "mongoose";

const studentAnalyticsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    recentQuizzes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Quiz",
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

const StudentAnalytics =
  mongoose.models.StudentAnalytics ||
  mongoose.model("StudentAnalytics", studentAnalyticsSchema);

export default StudentAnalytics;