import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = () => {
  const { user, isLoading } = useSelector(
    (state) => state.auth
  );

  // Wait for currentUser() to finish
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Already logged in
  if (user) {
    if (user.role === "student") {
      return <Navigate to="/student" replace />;
    }

    if (user.role === "teacher") {
      return <Navigate to="/teacher" replace />;
    }
  }

  // Not logged in
  return <Outlet />;
};

export default GuestRoute;