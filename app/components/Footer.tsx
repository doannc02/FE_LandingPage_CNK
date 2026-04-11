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
                thuật. Tôn chỉ "Nhân - Chí - Dũng": sống nhân hậu, nuôi ch지
                bền, hành động dũng cảm. Cơ sở Hà Đông{" "}
                <strong style={{ color: "var(--color-secondary)" }}>
                  MIỄN PHÍ
                </strong>{" "}
                cho mọi người!
              </p>
              <div className={styles.socialLinks}>
                <motion.a
                  href="#"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📘
                </motion.a>
                <motion.a
                  href="#"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📸
                </motion.a>
                <motion.a
                  href="#"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📹
                </motion.a>
                <motion.a
                  href="#"
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  💬
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
                <span>0123 456 789</span>
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
