import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { invokeJson, mcqSchema } from "./shared.js";

const outputSchema = z.object({
  questions: z.array(mcqSchema).min(2).max(10),
});

const State = Annotation.Root({
  chatSummary: Annotation(),
  questions: Annotation({ default: () => [] }),
});

const buildQuestions = async (state) => {
  const response = await invokeJson({
    systemPrompt:
      "You are an EDU-GAP quiz generator. Produce grounded MCQs from provided chat history only. Output strict JSON.",
    userPrompt: `Create between 2 and 10 multiple-choice questions from this student chat history.\n\nRules:\n- Ground each question in the chat content.\n- Use clear student-friendly phrasing.\n- Each question must include options and a single correctAnswer exactly matching one option.\n- Return JSON only in the format: {"questions":[{"questionText":"...","options":["..."],"correctAnswer":"..."}]}\n\nCHAT HISTORY:\n${state.chatSummary}`,
    outputSchema,
  });

  return { questions: response.questions };
};

const graph = new StateGraph(State)
  .addNode("buildQuestions", buildQuestions)
  .addEdge(START, "buildQuestions")
  .addEdge("buildQuestions", END)
  .compile();

export const runGenerateQuizQuestions = async ({ chatSummary }) => {
  const result = await graph.invoke({
    chatSummary: String(chatSummary || "").trim(),
  });
  return result.questions || [];
};
