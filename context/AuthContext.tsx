import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const HARD_USERNAME = 'admin';
const HARD_PASSWORD = 'shrimp123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const login = async (u: string, p: string) => {
    // Hardcoded credential check (no persistence needed).
    if (u === HARD_USERNAME && p === HARD_PASSWORD) {
      setIsLoggedIn(true);
      setUsername(u);
      return;
    }
    throw new Error('Invalid username or password');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ isLoggedIn, username, login, logout }),
    [isLoggedIn, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

