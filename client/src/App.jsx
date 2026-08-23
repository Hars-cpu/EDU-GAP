import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import StudentProgress from "./pages/StudentProgress";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import { setUser, clearUser } from "./redux/slices/authSlice";
import { toast } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import Chatbot from "./pages/Chatbot";

import Analytics from "./pages/Analytics";
import GuestRoute from "./components/GuestRoute";
import StudentQuiz from "./pages/StudentQuiz";
import {serverurl} from "./main.jsx";
import axios from "axios";

const CURRENT_USER_WELCOME_TOAST_ID = "current-user-welcome";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverurl}/api/auth/current-user`, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (!isMounted) return;
        dispatch(setUser(response.data.user));
        toast.success("User welcome back " + response.data.user.name, {
          toastId: CURRENT_USER_WELCOME_TOAST_ID,
        });
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.error(
          error.response?.data?.message || error.message,
          "Failed to fetch current user"
        );
        if (isMounted) dispatch(clearUser());
      }
    };

    getCurrentUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />
         
         <Route element={<GuestRoute />}>
  <Route
    path="/signin"
    element={<SignIn />}
  />

  <Route
    path="/signup"
    element={<SignUp />}
  />
</Route>
        

        {/* ================= STUDENT ================= */}

       <Route
  element={
    <ProtectedRoute allowedRoles={["student"]} />
  }
>
  <Route
    path="/student"
    element={<StudentDashboard />}
  />

  <Route
    path="/student/chatbot"
    element={<Chatbot />}
  />

  
   <Route
    path="/student/quiz"
    element={<StudentQuiz />}
  />

  {/* Open created quiz */}
  <Route
    path="/student/quiz/:quizId"
    element={<StudentQuiz />}
  />
  <Route
    path="/student/analytics"
    element={<StudentProgress/>}
  />

  
</Route>
        {/* ================= TEACHER ================= */}

        <Route
  element={
    <ProtectedRoute allowedRoles={["teacher"]} />
  }
>
  <Route
    path="/teacher"
    element={<TeacherDashboard />}
  />

  <Route
    path="/teacher/students"
    element={<StudentProgress />}
  />
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;