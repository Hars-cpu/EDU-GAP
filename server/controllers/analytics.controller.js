import StudentAnalytics from "../models/studentAnalytics.models.js";
import Quiz from "../models/quiz.models.js";
import User from "../models/user.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const studentId = req.user._id;

    const analytics = await StudentAnalytics.findOne({
      student: studentId,
    }).populate({
      path: "recentQuizzes",
      select: "-questions.correctAnswer",
    });

    if (!analytics) {
      return res.status(200).json({
        success: true,
        analytics: {
          recentQuizzes: [],
          overallProgressSummary: "",
          weakTopics: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      analytics: {
        overallProgressSummary: analytics.overallProgressSummary,
        weakTopics: analytics.weakTopics,
        recentQuizzes: analytics.recentQuizzes,
      },
    });
  } catch (error) {
    console.error("Get Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get analytics",
    });
  }
};

export const getInProgressQuizzes = async (req, res) => {
  try {
    const studentId = req.user._id;

    const quizzes = await Quiz.find({
      student: studentId,
      status: "in_progress",
    })
      .sort({ createdAt: -1 })
      .select("-questions.correctAnswer");

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Get In-Progress Quizzes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get in-progress quizzes",
    });
  }
};
export const getStudentAnalyticsForTeacher =
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const student = await User.findOne({
        _id: studentId,
        role: "student",
      }).select("_id name username email class");

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      const analytics =
        await StudentAnalytics.findOne({
          student: studentId,
        }).populate(
          "student",
          "name username email class"
        );

      if (!analytics) {
        return res.status(200).json({
          success: true,
          analytics: {
            student: {
              _id: student._id,
              name: student.name,
              username: student.username,
              email: student.email,
              className: student.class,
            },
            recentQuizzes: [],
            overallProgressSummary: "",
            weakTopics: [],
          },
        });
      }

      const analyticsPayload = analytics.toObject();
      analyticsPayload.student = {
        ...analyticsPayload.student,
        className: analyticsPayload.student?.class,
      };
      delete analyticsPayload.student?.class;

      res.status(200).json({
        success: true,
        analytics: analyticsPayload,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to get student analytics",
      });
    }
  };