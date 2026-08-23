import { runGenerateQuizQuestions } from "./quiz/generateQuizQuestions.graph.js";
import { runAnalyzeCurrentQuiz } from "./quiz/analyzeCurrentQuiz.graph.js";
import { runGenerateProgressSummary } from "./quiz/generateProgressSummary.graph.js";

export const generateQuizQuestions = async ({ chatSummary }) =>
  runGenerateQuizQuestions({ chatSummary });

export const analyzeCurrentQuiz = async ({ quiz }) =>
  runAnalyzeCurrentQuiz({ quiz });

export const generateProgressSummary = async ({ quizzes }) =>
  runGenerateProgressSummary({ quizzes });
