"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { authApi, type RegisterRequest } from "@/app/lib/api/auth";

// ── Types ──────────────────────────────────────────────────────────────────
export type UserRole = "SuperAdmin" | "SubAdmin" | "Student";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<{ isSuccess: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ isSuccess: boolean; error?: string }>;
  register: (
    data: RegisterRequest
  ) => Promise<{ isSuccess: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  isSuperAdmin: boolean;
  isSubAdmin: boolean;
  isAdminArea: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Firebase singleton ─────────────────────────────────────────────────────
function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key";
}

function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase chưa được cấu hình. Vui lòng thêm biến môi trường NEXT_PUBLIC_FIREBASE_* vào .env.local");
  }
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

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount
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

  // NOTE: We intentionally do NOT call onAuthStateChanged on mount.
  // Firebase Auth is only initialized lazily when loginWithGoogle() is called.
  // Session management is handled by JWT access/refresh token rotation.

  const saveUser = useCallback((u: AuthUser) => {
    setUser(u);
    localStorage.setItem("authUser", JSON.stringify(u));
  }, []);

  // ── Email/password login — direct backend, no Firebase ─────────────────
  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await authApi.login({ email, password });
        if (result.isSuccess && result.data) {
          saveUser({
            id: result.data.user.id,
            email: result.data.user.email,
            username: result.data.user.username,
            fullName: result.data.user.fullName,
            role: result.data.user.role as UserRole,
            avatarUrl: result.data.user.avatarUrl,
          });
          return { isSuccess: true };
        }
        const msg = result.error ?? "Email hoặc mật khẩu không đúng";
        setError(msg);
        return { isSuccess: false, error: msg };
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Đăng nhập thất bại";
        setError(msg);
        return { isSuccess: false, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    [saveUser]
  );

  // ── Google SSO — Firebase → exchange token ─────────────────────────────
  const loginWithGoogle = useCallback(async (): Promise<{ isSuccess: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    if (!isFirebaseConfigured()) {
      const msg = "Đăng nhập Google chưa được cấu hình. Vui lòng thêm Firebase API key vào .env.local";
      setError(msg);
      setIsLoading(false);
      return { isSuccess: false, error: msg };
    }
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const idToken = await credential.user.getIdToken(true);
      const result = await authApi.exchangeToken(idToken);
      if (!result.isSuccess || !result.data) {
        throw new Error(result.error ?? "Xác thực Google thất bại");
      }
      saveUser({
        id: result.data.user.id,
        email: result.data.user.email,
        username: result.data.user.username,
        fullName: result.data.user.fullName,
        role: result.data.user.role as UserRole,
        avatarUrl: result.data.user.avatarUrl,
      });
      return { isSuccess: true };
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Đăng nhập Google thất bại";
      setError(msg);
      return { isSuccess: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  // ── Register ───────────────────────────────────────────────────────────
  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authApi.register(data);
      if (result.isSuccess) {
        return { isSuccess: true };
      }
      const msg = result.error ?? "Đăng ký thất bại";
      setError(msg);
      return { isSuccess: false, error: msg };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đăng ký thất bại";
      setError(msg);
      return { isSuccess: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        await signOut(auth).catch(() => {});
      } catch {}
    }
    authApi.logout();
    setUser(null);
    localStorage.removeItem("authUser");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginWithEmail,
        loginWithGoogle,
        register,
        logout,
        clearError,
        isSuperAdmin: user?.role === "SuperAdmin",
        isSubAdmin: user?.role === "SubAdmin",
        isAdminArea:
          user?.role === "SuperAdmin" || user?.role === "SubAdmin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
