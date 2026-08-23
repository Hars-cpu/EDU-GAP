import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getHistory, getVectorStore } from "./chatbotStore.js";
import { googleApiKey } from "../config/env.js";

const State = Annotation.Root({
  userId: Annotation(),
  question: Annotation(),
  context: Annotation({ reducer: (_, value) => value, default: () => [] }),
  answer: Annotation(),
});

const retrieve = async (state) => {
  const vectorStore = getVectorStore(state.userId);
  if (!vectorStore) return { context: [] };
  return { context: await vectorStore.similaritySearch(state.question, 4) };
};

const generate = async (state) => {
  if (!googleApiKey) {
    return { answer: "Gemini is not configured. Add GOOGLE_API_KEY to server/.env and restart the server." };
  }
  const model = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: "gemini-2.5-flash",
    temperature: 0.2,
  });
  const context = state.context.map((doc) => `[${doc.metadata.sourceName}]\n${doc.pageContent}`).join("\n\n");
  const history = getHistory(state.userId).slice(-8).map((item) => new HumanMessage(item.text));
  const prompt = context
    ? `Answer the student's question using the source excerpts when relevant. Cite source names naturally. If the excerpts do not answer it, say so clearly.\n\nSOURCE EXCERPTS:\n${context}\n\nQUESTION:\n${state.question}`
    : `Answer this student's question clearly and briefly: ${state.question}`;
  const response = await model.invoke([
    new SystemMessage("You are EduBridge's helpful learning assistant."),
    ...history,
    new HumanMessage(prompt),
  ]);
  return { answer: typeof response.content === "string" ? response.content : response.content.map((part) => part.text || "").join("") };
};

const graph = new StateGraph(State)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", END)
  .compile();

export const runChatbot = (userId, question) => graph.invoke({ userId: String(userId), question });
