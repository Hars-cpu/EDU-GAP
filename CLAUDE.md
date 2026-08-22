# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

EDU-GAP (branded "EduBridge" in the UI) is a learning platform with an AI doubt solver, source-based learning, adaptive quizzes, and progress analytics. The repository is split into a Vite/React frontend and a placeholder Node backend.

## Repository layout

- `client/` — implemented React 19 + Vite frontend.
  - `client/src/main.jsx` — browser entrypoint; mounts `<App />` in `StrictMode` and loads the global Tailwind stylesheet.
  - `client/src/App.jsx` — owns the top-level `BrowserRouter` and the route table (`/`, `/signin`, `/signup`).
  - `client/src/pages/` — route-level page components (`LandingPage.jsx`, `SignIn.jsx`, `SignUp.jsx`). Each page owns its own state, validation, and presentation. There is no shared layout, header, or design-system folder yet.
  - `client/src/index.css` — single Tailwind import (`@import "tailwindcss";`). `App.css` is currently empty.
  - `client/vite.config.js` — wires `@vitejs/plugin-react` and `@tailwindcss/vite`.
  - `client/eslint.config.js` — flat config: recommended JS + `react-hooks` + `react-refresh`, ignores `dist`.
- `server/` — placeholder. Contains only `package.json`; its scripts expect an `index.js` entrypoint that does not exist yet. Do not assume API routes or a backend contract.
- `.github/copilot-instructions.md` — already documents the same repo layout/conventions; keep this file in sync with that one when architecture changes.
- `.claude/settings.json` — enables the official `context7` plugin; keep assistant configuration compatible with that integration.

## Common commands

Run from `client/` unless noted:

```
npm install        # first setup or after package-lock changes
npm run dev        # Vite dev server (default: http://localhost:5173)
npm run build      # production build to dist/
npm run lint       # ESLint over *.js / *.jsx
npm run preview    # preview the production build
```

`server/` scripts (currently non-functional until `index.js` is added):

```
npm run dev        # nodemon index.js
npm start          # node index.js
npm test           # intentionally exits with "no test specified"
```

The client has no test script, test runner, or test files yet. Do not invoke a made-up `npm test`; when tests are added, document the runner and the single-test selector here.

## Frontend architecture and conventions

- Routing uses React Router v7. Navigation must go through `Link` / `useNavigate` — never `window.location`. Adding a new page means adding a file under `client/src/pages/` and a `<Route>` in `App.jsx`.
- Pages are functional components using local hooks (`useState`, `useNavigate`). There is no global state, no context provider, and no data-fetching library yet.
- Styling is Tailwind v4 utility classes only (no CSS modules, no styled-components). The `@tailwindcss/vite` plugin is the source of Tailwind — do not add a `tailwind.config.js` unless a deliberate change is required.
- Visual language: green brand tokens such as `#008F6B`, `#E2F5EF`, `#17221F`, `#75827E`; `react-icons/fi` for iconography; `framer-motion` for enter/scroll/hover transitions. New UI should match this system.
- String/import style follows what is already in the file being edited. The existing pages use double quotes; the Vite and ESLint configs use single quotes. Match local style.
- New client files should be `.js` or `.jsx` and pass the flat ESLint config.

## Authentication flow (frontend-only prototype)

SignIn and SignUp are currently hard-coded — sign-in checks fake users in-memory, sign-up calls a fake delayed API. When wiring to a real backend:

- Preserve the existing validation, loading state, disabled-while-submitting behavior, and `react-toastify` feedback.
- Continue to read backend errors from `error.response.data.message` and per-field errors from `error.response.data.errors`.
- Clear an individual field's error when that field changes; validate all relevant fields before firing the API call.
- Do not introduce a backend contract without coordinating it with whoever implements `server/`.

## Notes for future work

- The server is a stub. Pick a stack (Express is the implied default from `nodemon index.js`) and add `index.js` plus any routes; update this file and `copilot-instructions.md` once a contract exists.
- There is no test runner yet. Adding Vitest + React Testing Library is the natural fit for a Vite + React project; document the single-test selector in this file when introduced.
- No shared layout, header, footer, or design-system components exist. If a third page is added, extract a shared `Layout`/`Navbar` rather than copy-pasting the navbar markup that `LandingPage.jsx` currently inlines.
