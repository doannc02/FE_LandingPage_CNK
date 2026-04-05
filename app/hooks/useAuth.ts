"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { authApi, type AuthResponse } from "@/app/lib/api/auth";

// ── Firebase App init (singleton) ──────────────────────────────────────────
function getFirebaseAuth() {
  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
  return getAuth();
}

// ── Types ───────────────────────────────────────────────────────────────────
export type UserRole = "SuperAdmin" | "SubAdmin" | "Student";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isSubAdmin: boolean;
  isAdminArea: boolean; // SuperAdmin || SubAdmin
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Persist user profile from localStorage between reloads
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Sync with Firebase auth state changes (token expiry etc.)
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Firebase signed out — clear everything
        setUser(null);
        authApi.logout();
        localStorage.removeItem("authUser");
      }
    });
    return unsubscribe;
  }, []);

  /** Gọi backend exchange-token và cập nhật state */
  const handleExchange = useCallback(async (firebaseUser: FirebaseUser) => {
    const idToken = await firebaseUser.getIdToken(/* forceRefresh */ true);
    const result = await authApi.exchangeToken(idToken);

    if (!result.isSuccess || !result.data) {
      throw new Error(result.error ?? "Exchange token thất bại");
    }

    const profile: AuthUser = {
      id: result.data.user.id,
      email: result.data.user.email,
      username: result.data.user.username,
      fullName: result.data.user.fullName,
      role: result.data.user.role as UserRole,
      avatarUrl: result.data.user.avatarUrl,
    };

    setUser(profile);
    localStorage.setItem("authUser", JSON.stringify(profile));
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await handleExchange(credential.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập Google thất bại";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [handleExchange]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await handleExchange(credential.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [handleExchange]);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setUser(null);
    authApi.logout();
    localStorage.removeItem("authUser");
  }, []);

  return {
    user,
    isLoading,
    error,
    loginWithGoogle,
    loginWithEmail,
    logout,
    isSuperAdmin: user?.role === "SuperAdmin",
    isSubAdmin: user?.role === "SubAdmin",
    isAdminArea: user?.role === "SuperAdmin" || user?.role === "SubAdmin",
  };
}
