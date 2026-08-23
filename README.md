# EDU-GAP

EDU-GAP, branded as **EduBridge** in the interface, is a learning platform prototype for source-based learning, AI-assisted doubt solving, quizzes, and learning analytics.

## Current status

The React frontend is the currently working part of the project. It includes:

- A landing page and guest-only sign-in/sign-up flows.
- Redux-backed authentication state with current-user checks.
- Role-based student and teacher route protection.
- Student dashboard, chatbot, quiz, and analytics screens.
- Teacher dashboard and student-progress screen.
- A source-grounded doubt-chat prototype with simulated source uploads, URL sources, processing steps, and assistant responses.
- Axios requests prepared for authentication endpoints on a local server at `http://localhost:5000`.

The backend is not implemented yet. `server/package.json` contains the planned Node/Express dependencies and scripts, but `server/index.js` and API routes are currently missing. The chatbot's source processing and responses are also local UI simulations rather than live AI functionality.

## File structure

```text
EDU-GAP/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DoubtChat/        # Chat workspace, source panel/modal, and UI constants
│   │   │   ├── GuestRoute.jsx    # Redirects authenticated users away from guest pages
│   │   │   └── ProtectedRoute.jsx  # Role-based route guard
│   │   ├── pages/                # Landing, auth, dashboards, chatbot, quiz, and analytics screens
│   │   ├── redux/
│   │   │   ├── slices/authSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx               # BrowserRouter and application route table
│   │   ├── main.jsx              # React entrypoint, Redux Provider, and ToastContainer
│   │   ├── index.css             # Tailwind CSS entrypoint
│   │   └── App.css
│   ├── eslint.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   └── package.json              # Backend dependencies/scripts; implementation pending
├── .github/
│   └── copilot-instructions.md   # Repository guidance for Copilot sessions
├── .claude/
│   └── settings.json             # Claude context7 plugin configuration
├── CLAUDE.md
└── README.md
```

## Routes

| Access | Routes |
| --- | --- |
| Public | `/` |
| Guest-only | `/signin`, `/signup` |
| Student-only | `/student`, `/student/chatbot`, `/student/quiz`, `/student/analytics` |
| Teacher-only | `/teacher`, `/teacher/students` |

## Running the client

Run these commands from `client/`:

```powershell
npm install
npm run dev       # Start the Vite development server
npm run build     # Build the production bundle in client/dist/
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

The client does not currently have a test runner or test files configured.

## Server scripts

Run these commands from `server/` after a backend entrypoint is added:

```powershell
npm run dev
npm start
```

The existing `npm test` script is an unconfigured placeholder and intentionally exits with `Error: no test specified`.
