"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
        <motion.div
          className={styles.decorativeCircle}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Shadow animation - Người cầm côn */}
      <div className={styles.martialArtsShadow}></div>

      <div className="container">
        <motion.div
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.heroTag} variants={itemVariants}>
            <span className={styles.tagIcon}>⚡</span>
            <span>Câu lạc bộ võ thuật chính thống</span>
          </motion.div>

          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            <span className={styles.titleMain}>Côn Nhị Khúc</span>
            <span className={styles.titleSub}>Hà Đông</span>
          </motion.h1>

          <motion.div className={styles.heroSubtitle} variants={itemVariants}>
            <div className={styles.decorativeLine}></div>
            <p>
              CLB rèn luyện thể chất và tinh thần qua côn nhị khúc nghệ thuật.{" "}
              <strong style={{ color: "var(--color-secondary)" }}>
                MIỄN PHÍ
              </strong>{" "}
              cho mọi người tại Hà Đông
            </p>
          </motion.div>

          <motion.div className={styles.philosophy} variants={itemVariants}>
            <h3 className={styles.philosophyTitle}>
              Tôn chỉ: "Nhân - Chí - Dũng"
            </h3>
            <div className={styles.philosophyItems}>
              <div className={styles.philosophyItem}>
                <span className={styles.philosophyIcon}>❤️</span>
                <span className={styles.philosophyText}>Sống nhân hậu</span>
              </div>
              <div className={styles.philosophyItem}>
                <span className={styles.philosophyIcon}>🎯</span>
                <span className={styles.philosophyText}>Nuôi chí bền</span>
              </div>
              <div className={styles.philosophyItem}>
                <span className={styles.philosophyIcon}>💪</span>
                <span className={styles.philosophyText}>
                  Hành động dũng cảm
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.heroStats} variants={itemVariants}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>Năm kinh nghiệm</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Học viên</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Giải thưởng</span>
            </div>
          </motion.div>

          <motion.div className={styles.heroCta} variants={itemVariants}>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Đăng ký học</span>
            </motion.button>
            <motion.button
              className="btn btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Xem khóa học</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ⭐ CỬA SỔ ẢNH GÓC PHẢI */}
        <motion.div
          className={styles.heroImageWindow}
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className={styles.imageWindowFrame}>
            <motion.div
              className={styles.imageWindowInner}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(212, 175, 55, 0.4)",
                  "0 0 50px rgba(212, 175, 55, 0.6)",
                  "0 0 30px rgba(212, 175, 55, 0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              {/* Ảnh chính trong cửa sổ */}
              <Image
                src="/images/logo.png"
                alt="Logo CLB Côn Nhị Khúc"
                fill
                style={{ objectFit: "cover" }}
                className={styles.windowImage}
                priority
              />

              {/* Overlay gradient */}
              <div className={styles.imageWindowOverlay}></div>

              {/* Badge góc trên */}
              <div className={styles.windowBadge}>
                <span>⭐</span>
                <span>CLB CHÍNH THỐNG</span>
              </div>
            </motion.div>

            {/* Floating elements xung quanh cửa sổ */}
            <motion.div
              className={styles.floatingElement}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className={styles.floatingText}>Mạnh mẽ</span>
            </motion.div>

            <motion.div
              className={styles.floatingElement2}
              animate={{
                y: [10, -10, 10],
                rotate: [0, -5, 0, 5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className={styles.floatingText}>Linh hoạt</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span>↓</span>
      </motion.div>
    </section>
  );
}
