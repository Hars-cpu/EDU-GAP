import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Role is not allowed
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;