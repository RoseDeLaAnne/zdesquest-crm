import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProdiver";

export const ProtectedRoute = () => {
  const { access } = useAuth();

  // Check if the user is authenticated
  if (!access) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
