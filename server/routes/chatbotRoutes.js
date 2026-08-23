import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { addSource, getHistory, appendHistory, indexChunks, listSources, removeSource } from "../services/chatbotStore.js";
import { runChatbot } from "../services/chatbotGraph.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
router.use(protect);
           
const chunkText = (text, size = 1200) => {
  const chunks = [];
  for (let index = 0; index < text.length; index += size) chunks.push(text.slice(index, index + size));
  return chunks;
};

router.get("/sources", (req, res) => res.json({ sources: listSources(req.user._id) }));

router.post("/sources", upload.single("file"), async (req, res) => {
  try {
    const type = req.body.type || (req.file?.mimetype === "application/pdf" ? "pdf" : "image");
    let text = req.body.text || "";
    if (type === "url" && req.body.url) {
      const response = await fetch(req.body.url);
      text = (await response.text()).replace(/<[^>]+>/g, " ");
    } else if (req.file) {
      text = req.file.buffer.toString("utf8");
    }
    const name = req.body.name || req.file?.originalname || req.body.url || "Untitled source";
    const source = addSource(req.user._id, { type, name, meta: req.file ? `${Math.ceil(req.file.size / 1024)} KB` : req.body.url || "In memory" });
    await indexChunks(req.user._id, chunkText(text).map((chunk) => ({ sourceId: source.id, sourceName: source.name, text: chunk })));
    res.status(201).json({ source, sources: listSources(req.user._id) });
  } catch (error) {
    res.status(400).json({ message: "Unable to process source", error: error.message });
  }
});

router.delete("/sources/:id", (req, res) => {
  removeSource(req.user._id, req.params.id);
  res.json({ sources: listSources(req.user._id) });
});

router.post("/chat", async (req, res) => {
  const message = String(req.body.message || "").trim();
  if (!message) return res.status(400).json({ message: "Message is required" });
  const result = await runChatbot(req.user._id, message);
  appendHistory(req.user._id, { role: "user", text: message }, { role: "assistant", text: result.answer });
  res.json({
    answer: result.answer,
    sourcesUsed: [...new Set(
      (result.context || []).map((item) => item.metadata?.sourceName).filter(Boolean)
    )],
    history: getHistory(req.user._id),
  });
});

export default router;
