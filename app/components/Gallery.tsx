"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const ref = useRef(null);
  // ✅ FIX: Bỏ once: true để animation chạy lại
  const isInView = useInView(ref, { amount: 0.3 });
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  const galleryImages = [
    {
      src: "/images/banner.png",
      title: "Đại gia đình Võ đường Côn Nhị Khúc Hà Đông",
      category: "Tập thể",
    },
    {
      src: "/images/logo.png",
      title: "Biểu tượng Võ đường",
      category: "Logo",
    },
    {
      src: "/images/banner.png",
      title: "Buổi tập luyện cuối tuần",
      category: "Tập luyện",
    },
    {
      src: "/images/logo.png",
      title: "Học viên mới",
      category: "Học viên",
    },
    {
      src: "/images/banner.png",
      title: "Sự kiện đặc biệt",
      category: "Sự kiện",
    },
    {
      src: "/images/logo.png",
      title: "Huấn luyện viên",
      category: "Đội ngũ",
    },
  ];

  const videos = [
    {
      thumbnail: "/images/logo.png",
      title: "Video giới thiệu Võ đường Côn Nhị Khúc Hà Đông",
      duration: "3:45",
    },
    {
      thumbnail: "/images/logo.png",
      title: "Hướng dẫn kỹ thuật cơ bản cho người mới",
      duration: "8:20",
    },
    {
      thumbnail: "/images/logo.png",
      title: "Biểu diễn kỹ thuật nâng cao",
      duration: "5:15",
    },
    {
      thumbnail: "/images/logo.png",
      title: "Highlight buổi tập đặc biệt",
      duration: "4:30",
    },
  ];

  return (
    <section className="section" id="gallery" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>
            <span className={styles.labelIcon}>📸</span>
            Thư viện
          </span>
          <h2 className={styles.sectionTitle}>
            Khoảnh khắc <span className={styles.highlight}>đáng nhớ</span>
          </h2>
          <div
            className="decorative-line"
            style={{ margin: "1.5rem auto" }}
          ></div>
          <p className={styles.sectionDescription}>
            Hình ảnh và video về các hoạt động, buổi tập luyện và sự kiện của võ
            đường
          </p>
        </motion.div>

        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className={`${styles.tab} ${activeTab === "images" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("images")}
          >
            <span>📷</span>
            Hình ảnh
          </button>
          <button
            className={`${styles.tab} ${activeTab === "videos" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            <span>🎥</span>
            Video
          </button>
        </motion.div>

        {activeTab === "images" && (
          <div className={styles.galleryGrid}>
            {galleryImages.map((item, index) => (
              <motion.div
                key={index}
                className={styles.galleryItem}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.galleryImageWrapper}>
                  <img src={item.src} alt={item.title} />
                  <div className={styles.galleryOverlay}>
                    <span className={styles.galleryCategory}>
                      {item.category}
                    </span>
                    <h3 className={styles.galleryTitle}>{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "videos" && (
          <div className={styles.videoGrid}>
            {videos.map((video, index) => (
              <motion.div
                key={index}
                className={styles.videoItem}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.videoThumbnail}>
                  <img src={video.thumbnail} alt={video.title} />
                  <div className={styles.playButton}>
                    <span>▶</span>
                  </div>
                  <span className={styles.videoDuration}>{video.duration}</span>
                </div>
                <h3 className={styles.videoTitle}>{video.title}</h3>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className={styles.viewAllWrapper}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className={styles.viewAllButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Xem thêm {activeTab === "images" ? "hình ảnh" : "video"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
