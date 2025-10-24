import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to={`/${role}/login`} />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;
