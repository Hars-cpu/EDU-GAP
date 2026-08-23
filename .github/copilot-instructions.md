# Copilot instructions for EDU-GAP

## Project structure and architecture

EDU-GAP is branded as **EduBridge** in the UI. It is currently a Vite/React frontend paired with a not-yet-implemented Node backend.

- `client/` is the working application. `client/src/main.jsx` mounts the app in `StrictMode`, provides the Redux store, renders the global `ToastContainer`, and defines the hard-coded API base URL (`http://localhost:5000`).
- `client/src/App.jsx` owns the `BrowserRouter`, performs the current-user request on startup, and defines all routes:
  - Public: `/`
  - Guest-only: `/signin`, `/signup`
  - Student-only: `/student`, `/student/chatbot`, `/student/quiz`, `/student/analytics`
  - Teacher-only: `/teacher`, `/teacher/students`
- `GuestRoute` and `ProtectedRoute` gate nested routes with Redux auth state. Preserve role-based redirects when adding routes.
- `client/src/redux/store.js` contains the only configured global state. `redux/slices/authSlice.js` tracks `user`, `isAuthenticated`, and `isLoading`; pages otherwise keep state locally.
- `client/src/pages/` contains route-level screens. `Chatbot` composes the reusable `components/DoubtChat/` pieces (`DoubtChat`, source panel/modal, chat panel, and constants).
- The doubt-chat UI is currently a local simulation: source uploads/URLs, workflow progress, and assistant replies are held in component state and use timers. It is not yet connected to an AI or source-processing backend.
- `server/` has only `package.json`. It lists Express/Mongoose/auth/security dependencies and scripts targeting `server/index.js`, but that entrypoint and API implementation are absent. Do not infer a server contract from the dependency list.
- `.claude/settings.json` enables the official `context7` plugin. Keep assistant configuration compatible with it.

## Build, lint, and test commands

Run commands from the relevant package directory:

```powershell
# client/
npm install
npm run dev       # Vite dev server, normally http://localhost:5173
npm run build     # production build in client/dist/
npm run lint      # ESLint over client JavaScript/JSX; dist is ignored
npm run preview    # serve the production build
```

There is no client test script, test runner, or test file currently configured, so there is no supported full-suite or single-test command. Do not invent an `npm test` command; document a runner-specific selector here when tests are added.

```powershell
# server/
npm run dev       # nodemon index.js; currently fails because index.js is absent
npm start          # node index.js; currently fails because index.js is absent
npm test           # intentionally exits with "Error: no test specified"
```

## Frontend conventions

- Use functional React components and local hooks for page state. Add route-level screens under `client/src/pages/` and register them in `App.jsx`.
- Use React Router `Link`, `NavLink`, or `useNavigate` for navigation; do not use direct `window.location` changes.
- Use Tailwind v4 utility classes. Tailwind is loaded by `client/src/index.css` and the `@tailwindcss/vite` plugin in `client/vite.config.js`; do not add a `tailwind.config.js` without a deliberate Tailwind configuration change. `App.css` is currently empty.
- Match the existing UI system: green EduBridge colors such as `#008F6B`/`#008f68`, pale green backgrounds, `react-icons/fi`, and Framer Motion enter/hover/scroll transitions. Avoid introducing CSS modules or component-specific styling systems.
- Existing JSX uses double-quoted imports and strings; the Vite and ESLint config files use single quotes. Match the local file’s established style.
- Auth requests use Axios with `withCredentials: true` and the shared `serverurl` from `main.jsx` where available. Existing endpoints are `/api/auth/current-user`, `/api/auth/login`, `/api/auth/signup`, and `/api/auth/logout`.
- Preserve auth UX when changing API wiring: validate before submitting, clear only the edited field’s error, disable while loading, dispatch the appropriate auth action, and show feedback with `react-toastify`. Map backend messages from `error.response.data.message` and field errors from `error.response.data.errors`.
- Keep authentication transitions consistent with `authSlice`: successful login/current-user/signup dispatches `setUser`; logout or failed current-user lookup dispatches `clearUser`.
- New client `.js`/`.jsx` files must satisfy the flat ESLint configuration in `client/eslint.config.js` (recommended JavaScript, React Hooks, and React Refresh rules).
