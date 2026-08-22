# Copilot instructions for EDU-GAP

## Repository layout and architecture

- `client/` is the implemented frontend. It is a Vite app using React 19, React Router, Tailwind CSS v4, Framer Motion, React Icons, and React Toastify.
- `client/src/main.jsx` is the browser entrypoint. It imports the global Tailwind stylesheet and renders `App` in `StrictMode`.
- `client/src/App.jsx` owns the top-level `BrowserRouter` and route table:
  - `/` renders `LandingPage`
  - `/signin` renders `SignIn`
  - `/signup` renders `SignUp`
- Page components in `client/src/pages/` contain their own presentation and interaction logic. Navigation should use React Router (`Link` or `useNavigate`) rather than direct location changes.
- Styling is primarily Tailwind utility classes. `client/src/index.css` loads Tailwind with `@import "tailwindcss";`; `App.css` is currently empty. Tailwind is wired through the `@tailwindcss/vite` plugin in `client/vite.config.js`.
- Authentication is currently a frontend-only prototype: sign-in checks hard-coded fake users and sign-up calls a fake delayed API. Preserve the existing validation, loading state, toast feedback, and route behavior when replacing these with backend calls.
- `server/` currently contains only `package.json`. Its scripts expect an `index.js` entrypoint (`nodemon index.js` for development and `node index.js` for start), but no server implementation is present yet. Do not assume API routes or a backend contract exists.
- `.claude/settings.json` enables the official Claude `context7` plugin; keep repository assistant configuration compatible with that integration.

## Build, lint, and test commands

Run commands from the directory named below:

```powershell
# client/
npm install                 # first setup or after package-lock changes
npm run dev                 # start the Vite development server
npm run build               # create the production build in dist/
npm run lint                # run ESLint over JavaScript and JSX
npm run preview             # preview the production build
```

The client has no test script, test runner, or test files currently configured, so there is no supported full-suite or single-test command yet. Do not add a made-up `npm test` invocation; when tests are introduced, document the runner-specific single-test selector here.

The placeholder server package defines:

```powershell
# server/
npm run dev                 # requires server/index.js and nodemon
npm start                   # requires server/index.js
```

Its `npm test` script intentionally exits with “Error: no test specified”; treat that as an unconfigured test command, not a passing test suite.

## Code conventions in this repository

- Use functional React components and local React hooks (`useState`, `useNavigate`) for page state and interactions.
- Keep route-level pages under `client/src/pages/`; add shared UI only when it is genuinely reused across pages.
- Use double-quoted imports/strings in the existing JSX source, while preserving the established formatting in the file being edited. The Vite config and ESLint config use single quotes, matching their existing scaffold style.
- Use `react-icons/fi` icons and Framer Motion for the established visual language. Existing pages use motion enter/scroll/hover transitions and Tailwind classes rather than separate component CSS.
- Form pages validate all relevant fields before making an API call, clear an individual field’s error when that field changes, disable submit while loading, and surface success/failure through `react-toastify`.
- Keep form payload construction and backend error mapping explicit. The existing auth pages expect backend-style errors under `error.response.data.message` and optional field errors under `error.response.data.errors`.
- Keep the green EduBridge visual system consistent with existing Tailwind tokens such as `#008F6B`, `#E2F5EF`, `#17221F`, and `#75827E` unless a deliberate design change requires otherwise.
- ESLint uses the flat config in `client/eslint.config.js`, applies recommended JavaScript rules plus React Hooks and React Refresh rules, and ignores `dist`. New client files should be `.js` or `.jsx` and comply with that config.
