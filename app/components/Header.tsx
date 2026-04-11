"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";
import { useAuthContext } from "@/app/context/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, logout, isLoading } = useAuthContext();

  // Optimized scroll handler with debounce and threshold
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY.current) < 5) return;
      lastScrollY.current = currentScrollY;

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        const shouldBeScrolled = currentScrollY > 50;
        setIsScrolled((prev) =>
          prev !== shouldBeScrolled ? shouldBeScrolled : prev,
        );
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Track hash changes
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash || "");
    updateHash();
    window.addEventListener("hashchange", updateHash, { passive: true });
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("menuOpen");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("menuOpen");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("menuOpen");
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Trang chủ", href: "#home" },
    { label: "Giới thiệu", href: "#about" },
    { label: "Khóa học", href: "#courses" },
    { label: "Huấn luyện viên", href: "#coaches" },
    { label: "Thành tích", href: "#achievements" },
    { label: "Liên hệ", href: "#contact" },
  ];

  const isItemActive = useCallback(
    (href: string) => {
      if (currentHash === href) return true;
      if (
        !currentHash &&
        href === "#home" &&
        (pathname === "/" || pathname === "")
      )
        return true;
      return false;
    },
    [currentHash, pathname],
  );

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      // If not on home page, navigate there first
      if (pathname !== "/") {
        router.push(`/${href}`);
        return;
      }

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = 80;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });

        setTimeout(() => {
          window.history.pushState(null, "", href);
          setCurrentHash(href);
        }, 100);
      }
    },
    [pathname, router],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsUserMenuOpen(false);
    await logout();
    router.push("/");
  }, [logout, router]);

  // Generate avatar initials
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container">
        <div className={styles.headerContent}>
          {/* Logo */}
          <motion.div
            className={styles.logo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          >
            <Image
              src="/images/logo.png"
              alt="Võ đường Côn Nhị Khúc Hà Đông"
              width={50}
              height={50}
              className={styles.logoImage}
              priority
            />
            <div className={styles.logoText}>
              <h1>CÔN NHỊ KHÚC</h1>
              <p>Hà Đông</p>
            </div>
          </motion.div>

          {/* Nav */}
          <nav
            className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isItemActive(item.href) ? styles.active : ""}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </motion.a>
            ))}

            {/* Mobile auth links (only shown inside nav on small screens) */}
            <div className={styles.mobileAuthLinks}>
              {!isLoading && !user && (
                <>
                  <Link
                    href="/login"
                    className={styles.mobileLoginLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className={styles.mobileRegisterLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký thành viên
                  </Link>
                </>
              )}
              {!isLoading && user && (
                <button
                  className={styles.mobileLogoutBtn}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              )}
            </div>
          </nav>

          {/* Desktop auth area */}
          <div className={styles.authArea}>
            {isLoading ? (
              <div className={styles.authSkeleton} />
            ) : user ? (
              /* User dropdown */
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  type="button"
                  className={styles.userButton}
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName}
                      width={34}
                      height={34}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span className={styles.avatarInitials}>
                      {getInitials(user.fullName)}
                    </span>
                  )}
                  <span className={styles.userName}>
                    {user.fullName.split(" ").pop()}
                  </span>
                  <ChevronDownIcon
                    className={`${styles.chevron} ${isUserMenuOpen ? styles.chevronOpen : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={styles.dropdownHeader}>
                        <p className={styles.dropdownName}>{user.fullName}</p>
                        <p className={styles.dropdownEmail}>{user.email}</p>
                        <span className={styles.roleBadge}>
                          {roleLabel(user.role)}
                        </span>
                      </div>
                      <div className={styles.dropdownDivider} />
                      {(user.role === "SuperAdmin" ||
                        user.role === "SubAdmin") && (
                        <Link
                          href="/admin/dashboard"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <DashboardIcon />
                          Quản trị
                        </Link>
                      )}
                      <button
                        type="button"
                        className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                        onClick={handleLogout}
                      >
                        <LogoutIcon />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login / Register buttons */
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.loginButton}>
                  Đăng nhập
                </Link>
                <Link href="/register" className={styles.registerButton}>
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ""}`}
            />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function roleLabel(role: string) {
  if (role === "SuperAdmin") return "Super Admin";
  if (role === "SubAdmin") return "Võ sư";
  return "Học viên";
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="15"
      height="15"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="15"
      height="15"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
