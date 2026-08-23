import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { invokeJson, normalizeTopicList } from "./shared.js";

const outputSchema = z.object({
  progressSummary: z.string().min(1),
  weakTopics: z.array(z.string().min(1)).max(10),
});

const State = Annotation.Root({
  quizzes: Annotation(),
  summary: Annotation({ default: () => ({ progressSummary: "", weakTopics: [] }) }),
});

const buildSummary = async (state) => {
  const quizzes = Array.isArray(state.quizzes) ? state.quizzes : [];
  const digest = quizzes.map((quiz) => ({
    score: quiz.score,
    totalQuestions: quiz.totalQuestions,
    strengths: quiz.strengths || [],
    weakTopics: quiz.weakTopics || [],
    completedAt: quiz.completedAt,
  }));

  const response = await invokeJson({
    systemPrompt:
      "You are an EDU-GAP progress analyst. Summarize progress across recent quizzes and list recurring weak topics.",
    userPrompt: `Given these recent completed quizzes, return JSON only:\n{"progressSummary":"...","weakTopics":["..."]}\n\nKeep the summary concise and actionable.\n\nRECENT_QUIZZES:\n${JSON.stringify(
      digest,
      null,
      2
    )}`,
    outputSchema,
  });

  return {
    summary: {
      progressSummary: String(response.progressSummary || "").trim(),
      weakTopics: normalizeTopicList(response.weakTopics, 10),
    },
  };
};

const graph = new StateGraph(State)
  .addNode("buildSummary", buildSummary)
  .addEdge(START, "buildSummary")
  .addEdge("buildSummary", END)
  .compile();

export const runGenerateProgressSummary = async ({ quizzes }) => {
  const result = await graph.invoke({ quizzes });
  return result.summary;
};
