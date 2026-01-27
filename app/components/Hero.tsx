"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const features = [
    { icon: "✓", text: "Đội ngũ HLV cựu VĐV quốc gia" },
    { icon: "✓", text: "Cam kết đầu ra cho học viên" },
    { icon: "✓", text: "Phương pháp huấn luyện khoa học" },
    { icon: "✓", text: "Cơ sở vật chất hiện đại đạt chuẩn" },
  ];

  return (
    <section ref={ref} className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* ========================================
              LEFT CONTENT - 45%
          ======================================== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={styles.contentSection}
          >
            {/* Top Badge */}
            <motion.div variants={itemVariants} className={styles.badge}>
              <span className={styles.badgeDot} />
              <span>Võ Đường Côn Nhị Khúc Hà Đông</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 variants={itemVariants} className={styles.title}>
              Chinh phục{" "}
              <span className={styles.titleHighlight}>Côn Nhị Khúc</span> cùng{" "}
              <span className={styles.titleSecondary}>Cựu VĐV Quốc Gia</span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className={styles.description}>
              Rèn luyện ý chí chiến binh, phát triển thể chất toàn diện và nâng
              cao kỹ năng tự vệ thực chiến qua bộ môn võ thuật truyền thống đầy
              sức mạnh tại Võ Đường Côn Nhị Khúc Hà Đông.
            </motion.p>

            {/* Features - 2 Column Grid */}
            <motion.div
              variants={containerVariants}
              className={styles.featuresGrid}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  className={styles.featureItem}
                >
                  <div className={styles.featureIconWrapper}>
                    <span className={styles.featureIcon}>{feature.icon}</span>
                  </div>
                  <span className={styles.featureText}>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Highlight Stats */}
            <motion.div
              variants={containerVariants}
              className={styles.highlightStats}
            >
              <motion.div variants={itemVariants} className={styles.statBox}>
                <span className={styles.statIcon}>⚡</span>
                <span className={styles.statText}>
                  <strong>15+</strong> năm kinh nghiệm
                </span>
              </motion.div>
              <motion.div variants={itemVariants} className={styles.statBox}>
                <span className={styles.statIcon}>🎯</span>
                <span className={styles.statText}>
                  <strong>500+</strong> học viên xuất sắc
                </span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className={styles.ctaWrapper}>
              <motion.button
                className={styles.ctaPrimary}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Đăng ký học thử miễn phí</span>
                <svg
                  className={styles.ctaArrow}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 15L12.5 10L7.5 5"
                  />
                </svg>
              </motion.button>
              <motion.button
                className={styles.ctaSecondary}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Xem lịch khai giảng</span>
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className={styles.socialProof}>
              <div className={styles.ratingBox}>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                <span className={styles.ratingText}>
                  <strong>4.9/5</strong> · 1.200+ đánh giá từ học viên
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================
              RIGHT VISUAL GRID - 55%
          ======================================== */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={styles.visualSection}
          >
            <div className={styles.bentoGrid}>
              {/* BOX 1 - Main Action Shot */}
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.4 }}
                className={`${styles.bentoBox} ${styles.boxMain}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.mainImageWrapper}>
                  <img
                    src="/images/student1.jpg"
                    alt="Võ sư Côn Nhị Khúc biểu diễn"
                    className={styles.mainImage}
                    loading="eager"
                  />
                  <div className={styles.imageGradient} />
                </div>
                <motion.div
                  className={styles.boxBadge}
                  initial={{ opacity: 0, y: -20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <span className={styles.badgeIcon}>🥇</span>
                  <span className={styles.badgeLabel}>
                    Vô địch quốc gia 2023
                  </span>
                </motion.div>
              </motion.div>

              {/* BOX 2 - Action Shot 2 */}
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.5 }}
                className={`${styles.bentoBox} ${styles.boxAction}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.actionImageWrapper}>
                  <img
                    src="/images/banner.png"
                    alt="Học viên luyện tập côn nhị khúc"
                    className={styles.actionImage}
                    loading="lazy"
                  />
                </div>
                <motion.div
                  className={styles.boxBadge}
                  initial={{ opacity: 0, y: -20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 }}
                >
                  <span className={styles.badgeIcon}>💪</span>
                  <span className={styles.badgeLabel}>Rèn luyện mỗi ngày</span>
                </motion.div>
              </motion.div>

              {/* BOX 3 - Stats Card */}
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.6 }}
                className={`${styles.bentoBox} ${styles.boxStats}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.statsCard}>
                  <motion.div
                    className={styles.statsIcon}
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    👥
                  </motion.div>
                  <motion.div
                    className={styles.statsNumber}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    2000+
                  </motion.div>
                  <div className={styles.statsLabel}>Học viên</div>
                  <div className={styles.statsSubtext}>
                    Đã theo học tại võ đường
                  </div>
                </div>
              </motion.div>

              {/* BOX 4 - Logo Card */}
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.7 }}
                className={`${styles.bentoBox} ${styles.boxLogo}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.logoCard}>
                  <motion.img
                    src="/images/logo.png"
                    alt="Logo Võ Đường Côn Nhị Khúc Hà Đông"
                    className={styles.logoImage}
                    loading="lazy"
                    animate={{
                      rotate: [0, -2, 2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className={styles.logoOverlay}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.1 }}
                  >
                    <span className={styles.logoText}>Hà Đông</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* BOX 5 - Group Photo */}
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.8 }}
                className={`${styles.bentoBox} ${styles.boxGroup}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.groupImageWrapper}>
                  <img
                    src="/images/student4.jpg"
                    alt="Đại gia đình Võ Đường Hà Đông"
                    className={styles.groupImage}
                    loading="lazy"
                  />
                </div>
                <motion.div
                  className={styles.groupOverlay}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2 }}
                >
                  <span className={styles.groupText}>
                    Đại gia đình Võ Đường
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
