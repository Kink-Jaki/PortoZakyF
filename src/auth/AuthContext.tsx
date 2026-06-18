import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken, isAuthenticated, login as loginFn, logout as logoutFn } from './auth';

type AuthContextValue = {
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    setToken(getToken());
    setBooted(true);
  }, []);

  const isLoggedIn = useMemo(() => {
    // If localStorage has token, treat logged in.
    // (We keep it simple; backend verifies JWT on every request.)
    if (!booted) return false;
    return isAuthenticated();
  }, [booted]);

  const login = async (username: string, password: string) => {
    const t = await loginFn({ username, password });
    setToken(t);
  };

  const logout = () => {
    logoutFn();
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isLoggedIn,
      login,
      logout,
    }),
    [token, isLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

