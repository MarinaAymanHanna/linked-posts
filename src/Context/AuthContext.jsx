import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContextDef";
import { getMyProfile } from "../Services/authService";

export { AuthContext };

export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoggedin, setIsLoggedin] = useState(() => Boolean(localStorage.getItem("token")));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loadingUser, setLoadingUser] = useState(false);

  const refreshUserProfile = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setUser(null);
      return null;
    }
    try {
      setLoadingUser(true);
      const res = await getMyProfile();
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setLoadingUser(false);
    }
    return null;
  }, []);

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoggedin(true);
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    refreshUserProfile();
  }, [refreshUserProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setIsLoggedin(false);
    setUser(null);
  }, []);

  useEffect(() => {
    if (token) {
      // Defer to next tick to avoid synchronous setState inside effect body
      const timer = setTimeout(() => {
        refreshUserProfile();
      }, 0);
      return () => clearTimeout(timer);
    }

    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [token, refreshUserProfile, logout]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
        token,
        user,
        setUser,
        loadingUser,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}