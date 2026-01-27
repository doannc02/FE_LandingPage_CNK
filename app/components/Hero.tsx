"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const features = [
    { 
      icon: "✓",
      text: "Cam kết học lại miễn phí khi chưa đạt mục tiêu",
      color: "#f87614"
    },
    { 
      icon: "✓",
      text: "Đội ngũ HLV 100% được đào tạo bài bản",
      color: "#ff6b00"
    },
    { 
      icon: "✓",
      text: "Phương pháp huấn luyện khoa học có giáo trình rõ ràng, trực quan",
      color: "#ff9f4a"
    },
    { 
      icon: "✓",
      text: "Rút ngắn 40% thời gian học với phương pháp tự tập luyện tại nhà",
      color: "#f87614"
    },
    { 
      icon: "✓",
      text: "13+ năm kinh nghiệm trong lĩnh vực côn nhị khúc, tận tâm với học viên",
      color: "#ff6b00"
    },
  ];

  const stats = [
    {
      title: "Cam kết đạt hiệu quả",
      subtitle: "An tâm học hành",
      icon: "✓",
    },
    {
      title: "80% Cựu VĐV",
      subtitle: "Dạy giỏi, tận tâm",
      icon: "🏆",
    },
    {
      title: "40% Học nhanh hơn",
      subtitle: "Khoa học chứng minh",
      icon: "⚡",
    },
    {
      title: "98% Học Viên",
      subtitle: "Hài lòng với chất lượng",
      icon: "⭐",
    },
  ];

  const videos = [
    {
      url: "https://www.youtube.com/embed/LsEXa9dJoZE",
      title: "Video giới thiệu 1",
      badge: "Giới thiệu CLB",
      gridArea: "video1"
    },
    {
      url: "https://www.youtube.com/embed/LsEXa9dJoZE",
      title: "Video giới thiệu 2",
      badge: "Huấn luyện",
      gridArea: "video2"
    },
    {
      url: "https://www.youtube.com/embed/LsEXa9dJoZE",
      title: "Video giới thiệu 3",
      badge: "Thành tích",
      gridArea: "video3"
    },
    {
      url: "https://www.youtube.com/embed/LsEXa9dJoZE",
      title: "Video giới thiệu 4",
      badge: "Học viên",
      gridArea: "video4"
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={styles.hero}
      id="home"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={styles.container}
      >
        <div className={styles.heroGrid}>
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.contentSection}
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={styles.title}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Chinh phục Côn Nhị Khúc cùng{" "}
              </motion.span>
              <motion.span 
                className={styles.titleHighlight}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.5 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100
                }}
              >
                Võ đường Côn nhị khúc Hà Đông
              </motion.span>
            </motion.h1>

            {/* Features List */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={styles.featuresList}
            >
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className={styles.featureItem}
                  whileHover={{ 
                    x: 8, 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className={styles.featureIcon}
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    {feature.icon}
                  </motion.span>
                  <span className={styles.featureText}>{feature.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className={styles.ctaWrapper}
            >
              <motion.a
                href="tel:0868699860"
                className={styles.ctaPrimary}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 30px rgba(248, 118, 20, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 4px 20px rgba(248, 118, 20, 0.3)",
                    "0 6px 25px rgba(248, 118, 20, 0.5)",
                    "0 4px 20px rgba(248, 118, 20, 0.3)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  📞
                </motion.span>
                Đăng ký học thử miễn phí
              </motion.a>
              
              <motion.a
                href="#courses"
                className={styles.ctaSecondary}
                whileHover={{ 
                  scale: 1.03,
                  borderColor: "#f87614",
                  color: "#f87614"
                }}
                whileTap={{ scale: 0.97 }}
              >
                Xem lịch khai giảng
              </motion.a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.6, delay: 1 }}
              className={styles.socialProof}
            >
              <div className={styles.socialItem}>
                <div className={styles.avatarStack}>
                  {[1, 2, 3].map((i) => (
                    <motion.img
                      key={i}
                      src={`/images/student${i}.jpg`}
                      alt={`Học viên ${i}`}
                      className={styles.avatar}
                      initial={{ scale: 0, x: -20 }}
                      whileInView={{ scale: 1, x: 0 }}
                      viewport={{ amount: 0.5 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 1.1 + i * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        zIndex: 10,
                        transition: { duration: 0.2 }
                      }}
                    />
                  ))}
                </div>
                <motion.div 
                  className={styles.studentInfo}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ delay: 1.4 }}
                >
                  <strong>2,000+</strong> học viên tại TP.HCM
                </motion.div>
              </div>

              <motion.div 
                className={styles.ratingGroup}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.ratingBadge}>
                  <motion.span 
                    className={styles.ratingIcon}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    ⭐
                  </motion.span>
                  <span className={styles.ratingScore}>4.9</span>
                  <span className={styles.ratingMax}>/5</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className={styles.partners}
            >
              <span className={styles.partnerLabel}>Đối tác uy tín của hai đơn vị</span>
              <div className={styles.partnerLogos}>
                {[1, 2].map((i) => (
                  <motion.img
                    key={i}
                    src="/images/logo.png"
                    alt={`Logo ${i}`}
                    className={styles.partnerLogo}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.7, scale: 1 }}
                    viewport={{ amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 1.6 + i * 0.1 }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT - 4 VIDEOS GRID */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={styles.videoSection}
          >
            <div className={styles.videoGrid}>
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  className={styles.videoWrapper}
                  style={{ gridArea: video.gridArea }}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + index * 0.1,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredImage(index)}
                  onHoverEnd={() => setHoveredImage(null)}
                >
                  <div className={styles.videoContainer}>
                    <iframe
                      src={video.url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoIframe}
                    />
                  </div>
                  
                  {/* Overlay gradient khi hover */}
                  <motion.div
                    className={styles.videoOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredImage === index ? 0.3 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Badge */}
                  <motion.div 
                    className={styles.videoBadge}
                    initial={{ y: -10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ amount: 0.5 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={styles.badgeIcon}>▶️</span>
                    <span className={styles.badgeText}>{video.badge}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* STATS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className={styles.statsBar}
      >
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                backgroundColor: "rgba(248, 118, 20, 0.15)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className={styles.statIcon}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {stat.icon}
              </motion.div>
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={styles.statSubtitle}>{stat.subtitle}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}