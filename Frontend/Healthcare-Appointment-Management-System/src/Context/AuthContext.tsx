import React, {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { refreshToken as refreshApi, logout as logoutApi } from "../api/authService";
import type { AuthResponse, UserInfo } from "../api/types";
import { onAuthRefresh } from "../utils/axios";

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserInfo | null;
  token: string | null; // This will now be managed only in memory
  login: (authData: AuthResponse) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Server logout failed, clearing client session.", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");
    }
  }, []);

  const login = (authData: AuthResponse) => {
    setIsLoggedIn(true);
    setUser(authData.user);
    setAccessToken(authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));
  };

  useEffect(() => {
    // Listen for token refresh events from the axios interceptor
    const unsubscribe = onAuthRefresh((newAccessToken) => {
      setAccessToken(newAccessToken);
    });

    // Attempt to restore session on initial load
    const attemptSessionRestore = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          // Validate the session by calling refresh token
          const authData = await refreshApi();
          login(authData);
        } catch (error) {
          console.log("Session restore failed, logging out.");
          logout();
        }
      }
      setLoading(false);
    };

    attemptSessionRestore();
    return unsubscribe; // Cleanup the event listener
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token: accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};