"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const features = [
    { text: "Cam kết học lại miễn phí khi chưa đạt mục tiêu" },
    { text: "Đội ngũ HLV với 80% là Cựu VĐV Quốc Gia" },
    { text: "Phương pháp huấn luyện khoa học, bài bản" },
    { text: "Rút ngắn 40% thời gian học với phương pháp TOTAL IMMERSION" },
    { text: "15 năm kinh nghiệm đào tạo uy tín, tận tâm" },
  ];

  const stats = [
    {
      title: "Cam kết đạt hiệu quả",
      subtitle: "An tâm học hành",
    },
    {
      title: "80% Cựu VĐV",
      subtitle: "Dạy giỏi, tận tâm",
    },
    {
      title: "40% Học nhanh hơn",
      subtitle: "Khoa học chứng minh",
    },
    {
      title: "98% Học Viên",
      subtitle: "Hài lòng với chất lượng",
    },
  ];

  return (
    <section ref={ref} className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* LEFT CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={styles.contentSection}
          >
            {/* Main Title */}
            <motion.h1 variants={itemVariants} className={styles.title}>
              Chinh phục Côn Nhị Khúc cùng{" "}
              <span className={styles.titleHighlight}>Cựu VĐV Quốc Gia</span>
            </motion.h1>

            {/* Features List */}
            <motion.ul variants={containerVariants} className={styles.featuresList}>
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className={styles.featureItem}
                >
                  <span className={styles.checkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className={styles.featureText}>{feature.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className={styles.ctaWrapper}>
              <motion.a
                href="#contact"
                className={styles.ctaPrimary}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Đăng ký học thử miễn phí
              </motion.a>
              <motion.a
                href="#courses"
                className={styles.ctaSecondary}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Xem lịch khai giảng
              </motion.a>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className={styles.socialProof}>
              <div className={styles.avatarGroup}>
                <div className={styles.avatarStack}>
                  <img src="/images/avatar-default.png" alt="Học viên" className={styles.avatar} />
                  <img src="/images/avatar-default.png" alt="Học viên" className={styles.avatar} />
                  <img src="/images/avatar-default.png" alt="Học viên" className={styles.avatar} />
                </div>
                <div className={styles.studentCount}>
                  <span className={styles.countNumber}>2,000+</span>
                  <span className={styles.countLabel}> học viên tại Hà Đông</span>
                </div>
              </div>

              <div className={styles.ratingGroup}>
                <div className={styles.ratingBadge}>
                  <span className={styles.ratingIcon}>⭐</span>
                  <span className={styles.ratingScore}>4.9</span>
                  <span className={styles.ratingMax}>/5</span>
                </div>
              </div>
            </motion.div>

            {/* Partners */}
            <motion.div variants={itemVariants} className={styles.partners}>
              <span className={styles.partnerLabel}>Đối tác uy tín của</span>
              <div className={styles.partnerLogos}>
                <img src="/images/logo.png" alt="Võ Đường CNK" className={styles.partnerLogo} />
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT - VIDEO SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.videoSection}
          >
            <div className={styles.videoGrid}>
              {/* Main Video */}
              <div className={styles.mainVideoWrapper}>
                <iframe
                  src="https://www.youtube.com/embed/LsEXa9dJoZE?rel=0"
                  title="Giới thiệu Võ Đường Côn Nhị Khúc Hà Đông"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.mainVideo}
                />
              </div>

              {/* Side Images */}
              <div className={styles.sideImages}>
                <div className={styles.sideImageWrapper}>
                  <img
                    src="/images/banner.png"
                    alt="Học viên luyện tập"
                    className={styles.sideImage}
                  />
                  <div className={styles.imageBadge}>
                    <span className={styles.badgeIcon}>🥇</span>
                    <span className={styles.badgeText}>VĐV Quốc Gia</span>
                  </div>
                </div>
                <div className={styles.sideImageWrapper}>
                  <img
                    src="/images/student4.jpg"
                    alt="Đại gia đình võ đường"
                    className={styles.sideImage}
                  />
                </div>
                <div className={styles.sideImageWrapper}>
                  <img
                    src="/images/student1.jpg"
                    alt="Lớp học"
                    className={styles.sideImage}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* STATS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={styles.statsBar}
      >
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.statTitle}>{stat.title}</span>
              <span className={styles.statSubtitle}>{stat.subtitle}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
