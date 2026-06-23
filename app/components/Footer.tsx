"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: "Giới thiệu", href: "#about" },
      { label: "Huấn luyện viên", href: "#coaches" },
      { label: "Thành tích", href: "#achievements" },
    ],
    courses: [
      { label: "Khóa cơ bản", href: "#courses" },
      { label: "Khóa nâng cao", href: "#courses" },
      { label: "Chuyên nghiệp", href: "#courses" },
    ],
    contact: [
      { label: "Liên hệ", href: "#contact" },
      { label: "Đăng ký", href: "#contact" },
      { label: "FAQ", href: "#" },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.footerGrid}>
            <motion.div
              className={styles.footerBrand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.brandLogo}>
                <Image
                  src="/images/logo.png"
                  alt="Võ đường Côn Nhị Khúc Hà Đông"
                  width={80}
                  height={80}
                  className={styles.logoImage}
                />
                <div className={styles.logoText}>
                  <h3>CÔN NHỊ KHÚC</h3>
                  <p>Hà Đông</p>
                </div>
              </div>
              <p className={styles.brandDescription}>
                Võ đường rèn luyện thể chất và tinh thần qua côn nhị khúc nghệ
                thuật. Tôn chỉ &ldquo;Nhân - Chí - Dũng&rdquo;: sống nhân hậu, nuôi chí
                bền, hành động dũng cảm. Cơ sở Hà Đông{" "}
                <strong style={{ color: "var(--color-secondary)" }}>
                  MIỄN PHÍ
                </strong>{" "}
                cho mọi người!
              </p>
              <div className={styles.socialLinks}>
                {/* Facebook */}
                <motion.a
                  href="https://www.facebook.com/connhikhuchadong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Facebook"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/connhikhuchadong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Instagram"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>
                {/* YouTube */}
                <motion.a
                  href="https://www.youtube.com/@connhikhuchadong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="YouTube"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>
                {/* Zalo */}
                <motion.a
                  href="https://zalo.me/connhikhuchadong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Zalo"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 48 48" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-1.5 28.5H18v-13h4.5v13zm-2.25-14.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5zM33 32.5h-4.5v-7c0-1.66-.84-2.5-2.25-2.5S24 23.84 24 25.5v7h-4.5v-13H24v1.75c.75-1.25 2.1-2 3.75-2C30.75 19.25 33 21.5 33 25v7.5z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className={styles.footerLinks}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4>Về chúng tôi</h4>
              <ul>
                {footerLinks.about.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className={styles.footerLinks}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4>Khóa học</h4>
              <ul>
                {footerLinks.courses.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className={styles.footerContact}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4>Liên hệ</h4>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>Quận Hà Đông, Hà Nội</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>0868.699.860</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <span>contact@connhikhuchadong.vn</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🕐</span>
                <span>Thứ 2 - CN: 6:00 - 21:00</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>
              © {currentYear} Võ đường Côn Nhị Khúc Hà Đông. All rights
              reserved.
            </p>
            <div className={styles.footerBottomLinks}>
              <a href="#">Chính sách bảo mật</a>
              <span className={styles.divider}>|</span>
              <a href="#">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.decorativeElement}>
        <motion.div
          className={styles.floatingShape}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </footer>
  );
}
