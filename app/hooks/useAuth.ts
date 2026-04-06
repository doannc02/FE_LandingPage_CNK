"use client";

// Re-export from AuthContext so all existing imports of `useAuth` continue to work.
export {
  useAuthContext as useAuth,
  AuthProvider,
  type AuthUser,
  type UserRole,
} from "@/app/context/AuthContext";
