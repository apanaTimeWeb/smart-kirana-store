"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LoginFormValues, SignupFormValues, AuthUser } from "../types/AuthTypes";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextType {
  // Loading states
  isLoginLoading: boolean;
  isSignupLoading: boolean;

  // Actions — useCallback-memoized so consumer components never re-render
  // due to a new function reference being created on each parent render.
  login: (values: LoginFormValues) => void;
  signup: (values: SignupFormValues) => void;

  // State
  jwt: string | null;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  /**
   * login — memoized with useCallback so consumers do not re-render
   * when the Provider re-renders for unrelated state changes.
   * TODO: Replace the setTimeout mock with a real API call.
   */
  const login = useCallback(
    (values: LoginFormValues) => {
      setIsLoginLoading(true);
      // TODO: Replace with real API call
      setTimeout(() => {
        setJwt("mock-jwt-token");
        setUser({ phone: values.phone });
        setIsLoginLoading(false);
        router.push("/dashboard");
      }, 700);
    },
    [router]
  );

  /**
   * signup — memoized with useCallback.
   * TODO: Replace the setTimeout mock with a real API call.
   */
  const signup = useCallback(
    (values: SignupFormValues) => {
      setIsSignupLoading(true);
      // TODO: Replace with real API call
      setTimeout(() => {
        setJwt("mock-jwt-token-new");
        setUser({ phone: values.phone, name: values.ownerName, shop: values.shopName });
        setIsSignupLoading(false);
        router.push("/dashboard");
      }, 700);
    },
    [router]
  );

  /**
   * Memoize the context value object so that consumers only re-render
   * when one of these specific values actually changes — not on every
   * Provider render caused by an unrelated parent state update.
   */
  const contextValue = useMemo<AuthContextType>(
    () => ({
      isLoginLoading,
      isSignupLoading,
      login,
      signup,
      jwt,
      user,
    }),
    [isLoginLoading, isSignupLoading, login, signup, jwt, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Consumer Hook ────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
