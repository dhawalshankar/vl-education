"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { authAPI } from "@/app/lib/api";

const MAIN_API = process.env.NEXT_PUBLIC_MAIN_API_URL || "http://localhost:5000";
const TOKEN_KEY = "accessToken";

export interface LMSUser {
  id: string;
  email: string;
  full_name: string;
  name: string; // alias of full_name, for older pages
  role: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: LMSUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<LMSUser>;
  loginWithGoogle: (accessToken: string, email: string, name: string) => Promise<LMSUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ["cosmoindiaprakashan@gmail.com"];

const normalize = (u: any): LMSUser => {
  const isSuperAdmin = ADMIN_EMAILS.includes(u?.email?.toLowerCase());
  return {
    ...u,
    name: u?.full_name || u?.name || "",
    role: isSuperAdmin ? "admin" : (u?.role || "student"),
  };
};

const errText = (d: any, fallback: string) =>
  typeof d?.error === "string" ? d.error : typeof d?.detail === "string" ? d.detail : fallback;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }
    authAPI
      .getMe()
      .then((u) => {
        if (u) setUser(normalize(u));
        else localStorage.removeItem(TOKEN_KEY);
      })
      .catch((error) => {
        console.error("Could not restore saved session:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Shared steps 2 and 3: main-backend token -> SSO code -> LMS session
  const finishSso = useCallback(async (mainToken: string) => {
    const r2 = await fetch(`${MAIN_API}/sso/code`, {
      method: "POST",
      headers: { Authorization: `Bearer ${mainToken}` },
    });
    const d2 = await r2.json().catch(() => ({}));
    if (!r2.ok || !d2.code) throw new Error(errText(d2, "Could not start SSO"));

    const d3 = await authAPI.ssoExchange(d2.code);

    localStorage.setItem(TOKEN_KEY, d3.access_token);
    const u = normalize(d3.user);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const r1 = await fetch(`${MAIN_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d1 = await r1.json().catch(() => ({}));
      if (!r1.ok || !d1.token) throw new Error(errText(d1, "Login failed"));
      return finishSso(d1.token);
    },
    [finishSso]
  );

  const loginWithGoogle = useCallback(
    async (accessToken: string, email: string, name: string) => {
      const r1 = await fetch(`${MAIN_API}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleAccessToken: accessToken, email, name }),
      });
      const d1 = await r1.json().catch(() => ({}));
      if (!r1.ok || !d1.token) {
        const err: any = new Error(errText(d1, "Google login failed"));
        err.status = r1.status;
        err.notFound = r1.status === 404 || /not found/i.test(errText(d1, ""));
        throw err;
      }
      return finishSso(d1.token);
    },
    [finishSso]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" || (!!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())),
        isInstructor: user?.role === "instructor",
        isStudent: user?.role === "student",
        login,
        loginWithGoogle,
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