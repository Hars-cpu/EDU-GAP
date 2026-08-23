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

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import { setUser, clearUser } from "./redux/slices/authSlice";
import { toast } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";

import GuestRoute from "./components/GuestRoute";

import {serverurl} from "./main.jsx";
import axios from "axios";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverurl}/api/auth/current-user`, {
          withCredentials: true,
        });

        dispatch(setUser(response.data.user));
        toast.success("User welcome back " + response.data.user.name);
      } catch (error) {
        console.error(
          error.response?.data?.message || error.message,
          "Failed to fetch current user"
        );
        dispatch(clearUser());
      }
    };

    getCurrentUser();
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
            <ProtectedRoute
              allowedRoles={["student"]}
            />
          }
        >
          <Route
            path="/student"
            element={<StudentDashboard />}
          />
        </Route>

        {/* ================= TEACHER ================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["teacher"]}
            />
          }
        >
          <Route
            path="/teacher"
            element={<TeacherDashboard />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;