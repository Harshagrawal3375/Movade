"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { auth, hasFirebaseConfig } from "@/lib/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import * as api from "@/lib/api";
import type { PublicUser } from "@/lib/types";

export interface SessionUser extends PublicUser {
  displayName?: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function toSessionUser(u: PublicUser): SessionUser {
  return { ...u, displayName: u.name };
}

function fromFirebaseUser(u: FirebaseUser): SessionUser {
  return {
    id: u.uid,
    name: u.displayName ?? u.email ?? "Traveler",
    email: u.email ?? "",
    displayName: u.displayName ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (hasFirebaseConfig && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (cancelled) return;
        setUser(firebaseUser ? fromFirebaseUser(firebaseUser) : null);
        setLoading(false);
      });
      return () => {
        cancelled = true;
        unsubscribe();
      };
    }

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

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (hasFirebaseConfig && auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      setUser(fromFirebaseUser(credential.user));
      return;
    }
    const { user: created } = await api.signUp(name, email, password);
    setUser(toSessionUser(created));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (hasFirebaseConfig && auth) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(fromFirebaseUser(credential.user));
      return;
    }
    const { user: loggedIn } = await api.signIn(email, password);
    setUser(toSessionUser(loggedIn));
  }, []);

  const logout = useCallback(async () => {
    if (hasFirebaseConfig && auth) {
      await signOut(auth);
      setUser(null);
      return;
    }
    await api.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}