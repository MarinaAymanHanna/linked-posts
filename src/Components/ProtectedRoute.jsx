import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedin } = useContext(AuthContext);
  return isLoggedin ? children : <Navigate to="/login" replace />;
}
