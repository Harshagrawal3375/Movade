"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import * as api from "@/lib/api";
import type { PublicUser } from "@/lib/types";

export interface SessionUser extends PublicUser {
  displayName?: string;
}

interface SignupResult {
  needVerification: boolean;
  email: string;
  devCode?: string;
  error?: string;
  otpFailed?: boolean;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<SignupResult>;
  verifySignup: (email: string, code: string) => Promise<void>;
  resendSignupCode: (email: string) => Promise<string | undefined>;
  login: (email: string, password: string) => Promise<void>;
  sendLoginCode: (email: string) => Promise<string | undefined>;
  verifyLoginCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signup: async () => ({ needVerification: false, email: "" }),
  verifySignup: async () => {},
  resendSignupCode: async () => undefined,
  login: async () => {},
  sendLoginCode: async () => undefined,
  verifyLoginCode: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function toSessionUser(u: PublicUser): SessionUser {
  return { ...u, displayName: u.name };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .fetchMe()
      .then(({ user: me }) => {
        if (cancelled) return;
        setUser(me ? toSessionUser(me) : null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.signUp(name, email, password);
      if (res.user) setUser(toSessionUser(res.user));
      return {
        needVerification: res.needVerification ?? false,
        email: res.email ?? email.trim().toLowerCase(),
        devCode: res.devCode,
        error: res.error,
        otpFailed: res.otpFailed,
      };
    },
    []
  );

  const verifySignup = useCallback(async (email: string, code: string) => {
    const { user: verified } = await api.verifySignup(email, code);
    setUser(toSessionUser(verified));
  }, []);

  const resendSignupCode = useCallback(async (email: string) => {
    const res = await api.resendSignupCode(email);
    return res.devCode;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedIn } = await api.signIn(email, password);
    setUser(toSessionUser(loggedIn));
  }, []);

  const sendLoginCode = useCallback(async (email: string) => {
    const res = await api.sendLoginCode(email);
    return res.devCode;
  }, []);

  const verifyLoginCode = useCallback(async (email: string, code: string) => {
    const { user: loggedIn } = await api.verifyLoginCode(email, code);
    setUser(toSessionUser(loggedIn));
  }, []);

  const logout = useCallback(async () => {
    await api.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        verifySignup,
        resendSignupCode,
        login,
        sendLoginCode,
        verifyLoginCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
