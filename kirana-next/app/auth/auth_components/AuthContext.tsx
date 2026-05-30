"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginFormValues, SignupFormValues } from "./AuthTypes";

interface AuthContextType {
  // Loading states
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  
  // Actions
  login: (values: LoginFormValues) => void;
  signup: (values: SignupFormValues) => void;
  
  // State
  jwt: string | null;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  const login = (values: LoginFormValues) => {
    setIsLoginLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setJwt("mock-jwt-token");
      setUser({ phone: values.phone });
      setIsLoginLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  const signup = (values: SignupFormValues) => {
    setIsSignupLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setJwt("mock-jwt-token-new");
      setUser({ phone: values.phone, name: values.ownerName, shop: values.shopName });
      setIsSignupLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoginLoading,
        isSignupLoading,
        login,
        signup,
        jwt,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
