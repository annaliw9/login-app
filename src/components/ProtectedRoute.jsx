import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function MfaRoute() {
  const { isAuthenticated, isMfaPending } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  if (!isMfaPending) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function GuestRoute() {
  // console.log("GuestRoute rendered");

  const { isAuthenticated, isMfaPending, pendingUser } = useAuth();

  // console.log("GuestRoute:", {
  //   isAuthenticated,
  //   isMfaPending,
  //   pendingUser,
  // });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  if (isMfaPending) return <Navigate to="/mfa" replace />;

  return <Outlet />;
}
