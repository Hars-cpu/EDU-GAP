import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { invokeJson, normalizeTopicList } from "./shared.js";

const outputSchema = z.object({
  strongTopics: z.array(z.string().min(1)).max(8),
  weakTopics: z.array(z.string().min(1)).max(8),
});

const State = Annotation.Root({
  quiz: Annotation(),
  analysis: Annotation({ default: () => ({ strongTopics: [], weakTopics: [] }) }),
});

const buildAnalysis = async (state) => {
  const quiz = state.quiz || {};
  const questionDigest = (quiz.questions || []).map((question, index) => ({
    index: index + 1,
    questionText: question.questionText,
    selectedAnswer: question.selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect: question.isCorrect,
  }));

  const response = await invokeJson({
    systemPrompt:
      "You are an EDU-GAP quiz analyst. Infer concise strong and weak topic tags from the quiz performance.",
    userPrompt: `Analyze this completed quiz and return JSON only:\n{"strongTopics":["..."],"weakTopics":["..."]}\n\nQUIZ:\n${JSON.stringify(
      {
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        questions: questionDigest,
      },
      null,
      2
    )}`,
    outputSchema,
  });

  return {
    analysis: {
      strongTopics: normalizeTopicList(response.strongTopics),
      weakTopics: normalizeTopicList(response.weakTopics),
    },
  };
};

const graph = new StateGraph(State)
  .addNode("buildAnalysis", buildAnalysis)
  .addEdge(START, "buildAnalysis")
  .addEdge("buildAnalysis", END)
  .compile();

export const runAnalyzeCurrentQuiz = async ({ quiz }) => {
  const result = await graph.invoke({ quiz });
  return result.analysis;
};
