import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("newbanks_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}