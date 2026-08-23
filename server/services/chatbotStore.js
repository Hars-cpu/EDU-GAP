import crypto from "node:crypto";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { googleApiKey, googleEmbeddingModel } from "../config/env.js";

const users = new Map();

const getUserStore = (userId) => {
  if (!users.has(String(userId))) {
    users.set(String(userId), { sources: [], chunks: [], history: [], vectorStore: null });
  }
  return users.get(String(userId));
};

export const listSources = (userId) => getUserStore(userId).sources;
export const addSource = (userId, source, text = "") => {
  const store = getUserStore(userId);
  const item = { id: crypto.randomUUID(), ...source };
  store.sources.push(item);
  if (text.trim()) store.chunks.push({ sourceId: item.id, sourceName: item.name, text: text.trim() });
  return item;
};
export const removeSource = (userId, sourceId) => {
  const store = getUserStore(userId);
  store.sources = store.sources.filter((source) => source.id !== sourceId);
  store.chunks = store.chunks.filter((chunk) => chunk.sourceId !== sourceId);
};
export const getChunks = (userId) => getUserStore(userId).chunks;
export const indexChunks = async (userId, chunks) => {
  const store = getUserStore(userId);
  store.chunks.push(...chunks);
  if (!googleApiKey || !chunks.length) return;
  if (!store.vectorStore) {
    store.vectorStore = new MemoryVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: googleApiKey,
        model: googleEmbeddingModel,
      })
    );
  }
  await store.vectorStore.addDocuments(
    chunks.map((chunk) => new Document({ pageContent: chunk.text, metadata: chunk }))
  );
};
export const getVectorStore = (userId) => getUserStore(userId).vectorStore;
export const getHistory = (userId) => getUserStore(userId).history;
export const appendHistory = (userId, ...messages) => getUserStore(userId).history.push(...messages);
