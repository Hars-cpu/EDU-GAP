import Quiz from "../models/quiz.models.js";
import StudentAnalytics from "../models/studentAnalytics.models.js";
import { getHistory } from "../services/chatbotStore.js";
import {
  analyzeCurrentQuiz,
  generateProgressSummary,
  generateQuizQuestions,
} from "../ai/quizAgent.js";

const MIN_QUESTIONS = 2;
const MAX_QUESTIONS = 10;

const buildChatSummary = (history) =>
  history
    .filter((item) => item?.text)
    .map((item) => `${item.role === "assistant" ? "AI" : "Student"}: ${String(item.text).trim()}`)
    .join("\n")
    .trim();

const sanitizeQuestions = (rawQuestions) => {
  if (!Array.isArray(rawQuestions)) return [];

  const normalized = rawQuestions
    .map((question) => {
      const questionText = String(question?.questionText || "").trim();
      const options = Array.isArray(question?.options)
        ? question.options
            .map((option) => String(option || "").trim())
            .filter(Boolean)
        : [];
      const uniqueOptions = [...new Set(options)];
      const correctAnswer = String(question?.correctAnswer || "").trim();

      if (
        !questionText ||
        uniqueOptions.length < 2 ||
        uniqueOptions.length > 6 ||
        !correctAnswer ||
        !uniqueOptions.includes(correctAnswer)
      ) {
        return null;
      }

      return {
        questionText,
        options: uniqueOptions,
        correctAnswer,
      };
    })
    .filter(Boolean);

  return normalized.slice(0, MAX_QUESTIONS);
};

const sanitizeQuizForStudent = (quizDoc) => ({
  _id: quizDoc._id,
  origin: quizDoc.origin,
  status: quizDoc.status,
  totalQuestions: quizDoc.totalQuestions,
  currentQuestionIndex: quizDoc.currentQuestionIndex,
  score: quizDoc.score,
  strengths: quizDoc.strengths || [],
  weakTopics: quizDoc.weakTopics || [],
  completedAt: quizDoc.completedAt,
  createdAt: quizDoc.createdAt,
  updatedAt: quizDoc.updatedAt,
  questions: (quizDoc.questions || []).map((question) => ({
    _id: question._id,
    questionText: question.questionText,
    options: question.options,
    selectedAnswer: question.selectedAnswer,
    isCorrect: question.isCorrect,
  })),
});

export const createQuiz = async (req, res) => {
  try {
    const studentId = req.user?._id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const history = getHistory(studentId);
    if (!history.length) {
      return res.status(400).json({
        success: false,
        message: "No chat history found. Start a chat before generating a quiz.",
      });
    }

    const chatSummary = buildChatSummary(history);
    if (!chatSummary) {
      return res.status(400).json({
        success: false,
        message: "Chat history is empty. Start a chat before generating a quiz.",
      });
    }

    const generatedQuestions = await generateQuizQuestions({ chatSummary });
    const questions = sanitizeQuestions(generatedQuestions);

    if (questions.length < MIN_QUESTIONS) {
      return res.status(422).json({
        success: false,
        message: "Could not generate enough quiz questions from current chat history.",
      });
    }

    const quiz = await Quiz.create({
      student: studentId,
      origin: "chat",
      questions,
      totalQuestions: questions.length,
      currentQuestionIndex: 0,
      status: "in_progress",
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: sanitizeQuizForStudent(quiz),
    });
  } catch (error) {
    console.error("Create Quiz Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      quiz: sanitizeQuizForStudent(quiz),
    });
  } catch (error) {
    console.error("Get Quiz Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get quiz",
    });
  }
};

export const submitQuestionAnswer = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;
    const answer = String(req.body?.answer || "").trim();

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      student: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Quiz is already completed",
      });
    }

    const index = Number(questionIndex);
    if (!Number.isInteger(index) || index < 0 || index >= quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    const question = quiz.questions[index];
    if (!question.options.includes(answer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid answer option selected",
      });
    }

    question.selectedAnswer = answer;
    question.isCorrect = answer === question.correctAnswer;

    const nextServerIndex = Math.min(
      quiz.questions.length - 1,
      Math.max(Number(quiz.currentQuestionIndex || 0), index + 1)
    );
    quiz.currentQuestionIndex = nextServerIndex;

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
      quiz: sanitizeQuizForStudent(quiz),
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
    });
  }
};

export const completeQuiz = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({
      _id: quizId,
      student: studentId,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Quiz already completed",
      });
    }

    const score = quiz.questions.reduce(
      (count, question) => (question.isCorrect === true ? count + 1 : count),
      0
    );

    quiz.score = score;
    quiz.status = "completed";
    quiz.completedAt = new Date();
    quiz.currentQuestionIndex = Math.max(quiz.totalQuestions - 1, 0);

    const quizAnalysis = await analyzeCurrentQuiz({ quiz });
    quiz.strengths = quizAnalysis.strongTopics || [];
    quiz.weakTopics = quizAnalysis.weakTopics || [];
    await quiz.save();

    let completedQuizzes = await Quiz.find({
      student: studentId,
      status: "completed",
    }).sort({ completedAt: -1 });

    if (completedQuizzes.length > 3) {
      const quizzesToDelete = completedQuizzes.slice(3);
      await Quiz.deleteMany({ _id: { $in: quizzesToDelete.map((item) => item._id) } });
      completedQuizzes = completedQuizzes.slice(0, 3);
    }

    const progressAnalysis = await generateProgressSummary({
      quizzes: completedQuizzes,
    });

    const analytics = await StudentAnalytics.findOneAndUpdate(
      { student: studentId },
      {
        $set: {
          recentQuizzes: completedQuizzes.map((item) => item._id),
          overallProgressSummary: progressAnalysis.progressSummary || "",
          weakTopics: progressAnalysis.weakTopics || [],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Quiz completed successfully",
      result: {
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        strengths: quiz.strengths,
        weakTopics: quiz.weakTopics,
        overallProgressSummary: analytics.overallProgressSummary,
        overallWeakTopics: analytics.weakTopics,
      },
    });
  } catch (error) {
    console.error("Complete Quiz Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete quiz",
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const studentId = req.user._id;
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      student: studentId,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    await StudentAnalytics.findOneAndUpdate(
      { student: studentId },
      { $pull: { recentQuizzes: quiz._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete Quiz Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
};
