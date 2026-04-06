"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import styles from "./Register.module.css";

interface FormState {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, user, isLoading, error, clearError } =
    useAuthContext();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Vui lòng nhập họ và tên";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email không hợp lệ";
    if (!form.username.trim()) errs.username = "Vui lòng nhập tên người dùng";
    else if (form.username.length < 3)
      errs.username = "Tên người dùng phải có ít nhất 3 ký tự";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 8)
      errs.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    clearError();

    const result = await register({
      fullName: form.fullName,
      email: form.email,
      username: form.username,
      password: form.password,
    });

    if (result.isSuccess) {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    clearError();
    const result = await loginWithGoogle();
    if (result.isSuccess) router.push("/");
  };

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.heading}>Đăng ký thành công!</h1>
          <p className={styles.subheading}>
            Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu.
          </p>
          <Link href="/login" className={styles.submitButton}>
            Đăng nhập ngay
          </Link>
          <p className={styles.footer}>
            <Link href="/" className={styles.footerLink}>
              ← Về trang chủ
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/images/logo.png"
            alt="CLB Côn Nhị Khúc Hà Đông"
            width={56}
            height={56}
            className={styles.logoImage}
          />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>CÔN NHỊ KHÚC</span>
            <span className={styles.logoSub}>Hà Đông</span>
          </div>
        </Link>

        <h1 className={styles.heading}>Đăng ký thành viên</h1>
        <p className={styles.subheading}>
          Tham gia cộng đồng CLB Côn Nhị Khúc Hà Đông ngay hôm nay!
        </p>

        {/* API error */}
        {error && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIcon}>!</span>
            <span>{error}</span>
          </div>
        )}

        {/* Google SSO */}
        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogle}
          disabled={isLoading || submitting}
        >
          <GoogleIcon />
          <span>Đăng ký với Google</span>
        </button>

        <div className={styles.divider}>
          <span>hoặc điền form đăng ký</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>
              Họ và tên <span className={styles.required}>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ""}`}
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {fieldErrors.fullName && (
              <span className={styles.fieldError}>{fieldErrors.fullName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Tên người dùng <span className={styles.required}>*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`${styles.input} ${fieldErrors.username ? styles.inputError : ""}`}
              placeholder="nguyenvana"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            {fieldErrors.username && (
              <span className={styles.fieldError}>{fieldErrors.username}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Mật khẩu <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
                placeholder="Tối thiểu 8 ký tự"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeToggle}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Xác nhận mật khẩu <span className={styles.required}>*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ""}`}
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && (
              <span className={styles.fieldError}>
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || submitting}
          >
            {submitting || isLoading ? (
              <span className={styles.spinner} />
            ) : (
              "Tạo tài khoản"
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Đã có tài khoản?{" "}
          <Link href="/login" className={styles.footerLink}>
            Đăng nhập
          </Link>
        </p>
        <p className={styles.footer}>
          <Link href="/" className={styles.footerLink}>
            ← Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Icon components ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.7 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.3C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.4 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.3C37 38.4 44 33 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
