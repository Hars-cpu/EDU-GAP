import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });

export const googleApiKey = process.env.GOOGLE_API_KEY;
export const googleEmbeddingModel =
  process.env.GOOGLE_EMBEDDING_MODEL || "gemini-embedding-001";
