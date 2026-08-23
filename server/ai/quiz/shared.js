import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { googleApiKey } from "../../config/env.js";

const fencedJsonPattern = /```(?:json)?\s*([\s\S]*?)```/i;

export const parseModelText = (response) => {
  const content = response?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();
  }
  return "";
};

export const parseJsonFromText = (text) => {
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Model returned empty response.");

  const fencedMatch = trimmed.match(fencedJsonPattern);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;
  return JSON.parse(candidate);
};

export const normalizeTopicList = (value, maxItems = 8) => {
  if (!Array.isArray(value)) return [];
  const clean = value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return [...new Set(clean)].slice(0, maxItems);
};

export const getQuizLlm = () => {
  if (!googleApiKey) {
    throw new Error("GOOGLE_API_KEY is missing. Configure server/.env before using quiz agents.");
  }
  return new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: "gemini-3.6-flash",
    temperature: 0.2,
  });
};

export const invokeJson = async ({ systemPrompt, userPrompt, outputSchema }) => {
  const llm = getQuizLlm();
  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);
  const text = parseModelText(response);
  const parsed = parseJsonFromText(text);
  return outputSchema.parse(parsed);
};

export const mcqSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctAnswer: z.string().min(1),
});
