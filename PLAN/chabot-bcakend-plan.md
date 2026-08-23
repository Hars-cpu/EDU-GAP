# Chatbot Backend Plan — EduBridge "Ask your doubts" (Agentic RAG)

> Scope: this plan covers **only** the backend for the doubt-chat feature (`client/src/components/DoubtChat/`, mounted at `/student/chatbot`). It does not restructure `client/`, does not touch `authSlice`/Redux, and does not change the existing auth routes (`/api/auth/*`). It builds **inside** the already-scaffolded `server/` directory (Express/Mongoose/auth deps already declared in `server/package.json`), turning the currently-simulated chat (local state + timers) into a real, working feature.

---

## 1. What this replaces

Today, `DoubtChat` (source panel, add-source modal, chat panel) fakes everything client-side: fake upload progress, fake "Searching sources → Retrieving → Reranking → Generating" workflow, fake AI replies via `setTimeout`.

This plan adds a real backend so that:
- Uploaded PDFs / URLs / images are actually parsed, chunked, and embedded.
- Chat messages hit a real agent that decides whether to retrieve from the user's sources or answer directly.
- The existing UI workflow-status steps map to real Server-Sent Events instead of fake timers.

No visual/component changes needed — only swap the simulated handlers for real API calls.

---

## 2. How this fits the existing project

- **Auth already exists.** `/student/chatbot` sits behind `ProtectedRoute`, and Axios calls already use `withCredentials: true` with a session cookie from `/api/auth/login`. So **no separate `sessionId` header/UUID scheme is needed** — the chatbot's knowledge base is keyed by the authenticated user's id (`req.user._id`) pulled from the existing auth middleware, not a new session system.
- **`server/index.js` doesn't exist yet.** This plan is the first real backend work, so it also stands up the Express entrypoint — but stays scoped to what the chatbot needs (auth wiring for `req.user` is assumed to exist or be stubbed minimally; full auth backend is a separate plan).
- **Mongoose is already a dependency.** We use it only for lightweight metadata (which sources a user has uploaded), **not** for vectors — vectors stay in an in-memory store (RAM only, cleared on server restart), matching the "no real backend yet" hackathon scope.

---

## 3. Folder structure (additions inside `server/`)

```
server/
├── index.js                          # Express entrypoint (new)
├── src/
│   ├── config/
│   │   └── env.js                    # loads GOOGLE_API_KEY etc.
│   ├── middleware/
│   │   └── requireAuth.js            # reuses existing session/cookie auth
│   ├── models/
│   │   └── Source.js                 # Mongoose: { userId, name, type, size, addedAt }
│   ├── routes/
│   │   ├── sources.routes.js         # /api/chatbot/sources
│   │   └── chat.routes.js            # /api/chatbot/chat
│   ├── controllers/
│   │   ├── sources.controller.js
│   │   └── chat.controller.js
│   ├── services/
│   │   ├── knowledgeStore.js         # Map<userId, { vectorStore, sourceChunks }>
│   │   ├── ingestion/
│   │   │   ├── pdfLoader.js
│   │   │   ├── urlLoader.js
│   │   │   ├── imageLoader.js
│   │   │   └── index.js              # dispatch by source type
│   │   ├── vectorStore.js            # MemoryVectorStore create/query per user
│   │   └── embeddings.js
│   ├── agent/
│   │   ├── graph.js                  # LangGraph agent (one retriever tool)
│   │   ├── retrieverTool.js
│   │   └── model.js
│   └── utils/
│       └── chunking.js
├── uploads/                           # tmp raw files before parsing (gitignored)
├── .env
└── package.json                       # already exists — see §7 for additions
```

Everything lives under `server/`, namespaced under `/api/chatbot/...`, so it never collides with the future `/api/auth/...` implementation.

---

## 4. Knowledge store (per authenticated user, in-memory)

```js
// services/knowledgeStore.js
const store = new Map();
// store.get(userId) => {
//   vectorStore: MemoryVectorStore,
//   chunksBySourceId: Map<sourceId, Document[]>,  // for delete/rebuild
// }
```

- Keyed by `req.user._id` (from existing auth), not a custom session id.
- Lazily created on first source upload.
- Optional TTL sweep to evict idle users' vector data from RAM.
- `Source.js` Mongoose model stores only **metadata** (name/type/size) so the "Sources" panel can reload the list on page refresh even though the embeddings themselves are gone — on refresh, the UI can show sources as "needs re-indexing" if the vector store for that user is empty.

---

## 5. Ingestion pipeline (wires the "Add a knowledge source" modal)

`POST /api/chatbot/sources` (multipart for PDF/Image, JSON body for URL), guarded by `requireAuth`:

1. `sources.controller.js` reads `req.user._id`, the file/URL, and type (`pdf` / `url` / `image`) — matching the 3 tabs already in the modal UI.
2. `ingestion/index.js` dispatches:
   - **PDF** → `pdf-parse`
   - **URL** → `cheerio` + `axios`
   - **Image** → vision LLM call or `tesseract.js` OCR
3. `chunking.js` → `RecursiveCharacterTextSplitter` → chunks tagged `{ sourceId, sourceName, sourceType }`.
4. `vectorStore.js` → add chunks to that user's `MemoryVectorStore`; also save chunks in `chunksBySourceId` for later delete/rebuild.
5. Save metadata row via `Source.js` (Mongoose) so `GET /api/chatbot/sources` can list it.
6. Respond with the updated source list — same shape the "Sources" panel already renders (name, type, size, "Source ready" state).

`DELETE /api/chatbot/sources/:id` → remove metadata row + rebuild the user's vector store from remaining `chunksBySourceId` entries.

---

## 6. Chat endpoint + agent (wires the chat panel)

`POST /api/chatbot/chat` — body `{ message }`, guarded by `requireAuth`:

- Runs a small LangGraph agent (one bound tool: `retrieve_from_sources`, searching only `req.user`'s vector store).
- System prompt instructs the model to use the tool when the question likely relates to the user's uploaded material, and answer directly otherwise — this is the real version of the "Agentic RAG" badge already in the navbar.
- Response: `{ answer, sourcesUsed }` — `sourcesUsed` derived from which `sourceName`s appeared in the tool's output, so the UI's citation/workflow display has real data instead of a fake stepper.

**Streaming (optional but matches the existing UI):** upgrade to SSE so the four workflow steps already hardcoded in the frontend ("Searching sources… → Retrieving relevant chunks… → Reranking results… → Generating response…") become real progress events instead of a timed fake sequence — swap the component's `setTimeout` calls for `EventSource` listeners with the same step labels.

Conversation memory: keep a short in-memory `chatHistory` array per user alongside their vector store (or LangGraph's `MemorySaver` keyed by `userId`), so follow-up questions work without the frontend needing to resend full history.

---

## 7. `server/package.json` — additions only

Merge into the existing dependency list (don't remove auth/security deps already declared):

```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1",
    "langchain": "^0.3.0",
    "@langchain/core": "^0.3.0",
    "@langchain/langgraph": "^0.2.0",
    "@langchain/google-genai": "^0.1.0",
    "pdf-parse": "^1.1.1",
    "cheerio": "^1.0.0"
  }
}
```

(`express`, `mongoose`, `cors`, `dotenv`, auth/security packages are assumed already present per `copilot-instructions.md`.)

---

## 8. Build order (scoped to just this feature)

1. Stand up minimal `server/index.js` (Express + CORS + connect existing Mongoose setup) if not already done elsewhere — health route only.
2. Add `requireAuth` middleware that reads the existing session/cookie (reuse whatever `/api/auth/login` already sets — do not invent a new auth mechanism).
3. Add `Source.js` model + `/api/chatbot/sources` routes (metadata CRUD first, no embeddings yet) — confirm the "Sources" panel can list/delete real rows.
4. Wire PDF ingestion end-to-end (upload → parse → chunk → embed → in-memory store); verify with a manual similarity-search test.
5. Add URL and image ingestion using the same pipeline.
6. Build the LangGraph agent with the one retriever tool; test a query that should retrieve vs. one that shouldn't.
7. Wire `/api/chatbot/chat`; connect the chat panel's send button to it, replacing the simulated `AI Assistant` reply logic.
8. Replace the frontend's fake workflow-status timers with real SSE progress events (optional stretch).
9. Add idle-session TTL cleanup for the in-memory vector stores.

---

## 9. Key decisions locked in

- **Reuse existing auth/session — no parallel session system.** The chatbot's data is scoped by the same authenticated user identity the rest of the app already uses.
- **Vectors stay in RAM; only metadata persists in Mongo.** Matches the project's current "not yet implemented" backend state — nothing here requires a production vector DB.
- **One retriever tool, not one per source** — the agent searches the user's whole knowledge pool in a single call, so the frontend never needs a source-picker.
- **Everything namespaced under `/api/chatbot/...`** so it can be built and merged independently of the `/api/auth/...` backend work.
