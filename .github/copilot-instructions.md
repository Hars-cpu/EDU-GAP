# Copilot instructions for EDU-GAP

## Project overview

EDU-GAP is branded as **EduBridge** in the UI. It is a two-package learning platform: `client/` is a React 19/Vite frontend and `server/` is an ES-module Express backend. The product areas are authentication, student learning, source-grounded doubt solving, quizzes, and analytics.

## Build, test, and lint commands

Run commands from the package they target:

```powershell
# client/
cd client
npm install
npm run dev       # Vite development server, normally http://localhost:5173
npm run build     # production build in client/dist/
npm run lint      # ESLint for client JavaScript/JSX
npm run preview   # preview the production build
```

```powershell
# server/
cd server
npm install
npm run dev       # nodemon index.js
npm start         # node index.js
npm test          # placeholder script; intentionally exits with an error
```

There is currently no client test runner, test script, or test file, so no supported full-suite or single-test command exists. Do not invent an `npm test` selector; document the runner-specific command here when tests are added.

For local full-stack work, run the client and server in separate terminals. The client uses `http://localhost:5000` as its API base and the server allows the Vite origin with credentialed cookies. Configure `server/.env` from `server/.env.example`; `MONGO_URI` may be empty because auth and chatbot storage have an in-memory fallback, while `JWT_SECRET` is required for useful authentication and `GOOGLE_API_KEY` enables embedding-backed retrieval.

## Architecture

- `client/src/main.jsx` is the browser entrypoint. It mounts `App` in `StrictMode`, provides the Redux store, loads Tailwind, and renders the global `ToastContainer`. It exports the shared `serverurl` constant.
- `client/src/App.jsx` owns `BrowserRouter` and the route table. `/` is public; `/signin` and `/signup` are inside `GuestRoute`; student paths are protected with `allowedRoles={["student"]}`; teacher paths are protected with `allowedRoles={["teacher"]}`. The quiz route also has `/student/quiz/:quizId`.
- `App` checks `/api/auth/current-user` on startup. `ProtectedRoute` waits for `auth.isLoading`, redirects unauthenticated users to `/signin`, and redirects disallowed roles to `/`. `GuestRoute` redirects authenticated students or teachers to their dashboards.
- `client/src/redux/store.js` configures the only global slice, `redux/slices/authSlice.js`. It owns `user`, `isAuthenticated`, and `isLoading`; page and feature state is otherwise local to components.
- Route-level screens live under `client/src/pages/`. `Chatbot.jsx` hosts the reusable `components/DoubtChat/` workspace. The doubt-chat feature manages source selection, upload/URL ingestion, chat history, and workflow UI locally while calling the backend endpoints.
- `server/index.js` loads environment configuration, connects to MongoDB, configures CORS/JSON/cookies, and mounts `/api/auth`, `/api/chatbot`, `/api/quiz`, and `/api/analytics`. `server/middleware/authMiddleware.js` authenticates the HTTP-only JWT cookie and attaches `req.user`.
- Auth is implemented in `server/controllers/authController.js`: signup/login issue a seven-day `token` cookie, current-user and logout are protected, and the controller falls back to an in-memory user map when MongoDB is unavailable.
- Quiz and analytics behavior is split across their route/controller/AI graph files. Quiz creation, hydration, answer submission, completion, and deletion are authenticated. Check the existing controller response shapes before changing client API calls.
- Chatbot sources and history are keyed by authenticated user ID in `server/services/chatbotStore.js`. Source uploads are processed in `chatbotRoutes.js`, PDF text is extracted and chunked, optional Google embeddings are stored in a per-user in-memory vector store, and `chatbotGraph.js` generates answers. Vector data and chatbot history are lost on server restart.

## Frontend conventions

- Use functional components and hooks. Add new screens under `client/src/pages/` and register them in `App.jsx`; add reusable doubt-chat pieces under `client/src/components/DoubtChat/`.
- Use React Router `Link`, `NavLink`, `useNavigate`, `Navigate`, and `Outlet` for navigation and guards. Do not use direct `window.location` changes.
- Use Tailwind CSS v4 utility classes through `client/src/index.css` and `client/vite.config.js`. Do not add a Tailwind config or another styling system without deliberately changing the setup.
- Match the existing EduBridge visual language: green tokens such as `#008F6B`/`#008f68`, pale green surfaces, `react-icons/fi`, and Framer Motion transitions. Avoid CSS modules and component-specific styling systems.
- Existing JSX uses double-quoted imports and strings; Vite/ESLint configuration uses single quotes. Match the style of the file being edited.
- API calls use Axios with `withCredentials: true` and the shared `serverurl` from `main.jsx`. Preserve the established auth endpoints: `/api/auth/current-user`, `/api/auth/login`, `/api/auth/signup`, and `/api/auth/logout`.
- Preserve auth UX: validate before submitting, clear only the edited field error, disable controls while loading, dispatch `setUser` after successful auth, dispatch `clearUser` on logout or failed current-user lookup, and show feedback with `react-toastify`.
- Read general backend errors from `error.response.data.message` and field-level errors from `error.response.data.errors`. Do not silently replace failed API operations with success-shaped state; follow the surrounding component's explicit error handling.
- New client `.js`/`.jsx` files must pass the flat ESLint configuration in `client/eslint.config.js`, which enables recommended JavaScript, React Hooks, and React Refresh rules and ignores `dist`.

## Backend conventions

- Keep the server in ES modules (`"type": "module"`). Route modules own URL wiring and `protect` middleware; controllers handle auth/quiz/analytics operations, while chatbot processing belongs in its route/service layer.
- Preserve the existing cookie-based authentication contract. Protected requests depend on the `token` HTTP-only cookie and client credentialed requests; do not introduce a parallel session or user-ID header scheme.
- Keep chatbot state scoped by `req.user._id`, and preserve the existing source shapes (`id`, `type`, `name`, `meta`) returned to the Sources panel.
- Keep secrets in `server/.env`, not source or committed configuration. Update `.env.example` when adding required environment variables.
- When changing an API response or route, update both the corresponding client caller and server implementation. Do not infer a contract solely from dependency names or the planning document.

## Related project guidance

`CLAUDE.md` and `README.md` describe the same frontend/backend layout and should remain synchronized with this file when architecture or commands change. `.claude/settings.json` enables the official `context7` plugin; preserve compatibility with that configuration.
