"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { authAPI } from "@/app/lib/api";
import {
  exchangeCode,
  loginWithGoogleAccessToken,
  SSOError,
  SSOUser,
} from "@/lib/sso";

const TOKEN_KEY = "lms_access_token";
const USER_KEY = "lms_user";

export interface LMSUser extends SSOUser {
  name: string;
}

interface AuthContextType {
  user: LMSUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<LMSUser>;
  loginWithGoogle: (accessToken: string) => Promise<LMSUser>;
  loginWithCode: (code: string) => Promise<LMSUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalize = (user: SSOUser): LMSUser => ({
  ...user,
  name: user.full_name,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedToken) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    if (storedUser) {
      try {
        const restoredUser = normalize(JSON.parse(storedUser) as SSOUser);
        queueMicrotask(() => setUser(restoredUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    authAPI
      .getMe()
      .then((currentUser) => {
        const normalized = normalize(currentUser);
        setUser(normalized);
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = useCallback((session: { access_token: string; user: SSOUser }) => {
    const normalized = normalize(session.user);
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  }, []);

  const loginWithGoogle = useCallback(
    async (accessToken: string) => saveSession(await loginWithGoogleAccessToken(accessToken)),
    [saveSession]
  );

  const loginWithCode = useCallback(
    async (code: string) => saveSession(await exchangeCode(code)),
    [saveSession]
  );

  const login = useCallback(async () => {
    throw new SSOError("Email and password login is no longer available.", "UNKNOWN");
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.replace("/auth/login");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isInstructor: user?.role === "instructor",
        isStudent: user?.role === "student",
        login,
        loginWithGoogle,
        loginWithCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
