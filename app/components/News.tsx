'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './News.module.css';

export default function News() {
  const ref = useRef(null);
  // ✅ FIX: Bỏ once: true để animation chạy lại
  const isInView = useInView(ref, { amount: 0.3 });

  const featuredNews = {
    title: 'Câu lạc bộ Côn Nhị Khúc Hà Đông chính thức hoạt động MIỄN PHÍ',
    excerpt: 'Với mong muốn lan tỏa đam mê võ thuật và năng lượng tích cực, CLB Côn Nhị Khúc Hà Đông tự hào thông báo mở các lớp học hoàn toàn MIỄN PHÍ cho mọi lứa tuổi tại cơ sở Hà Đông.',
    date: '08/12/2024',
    category: 'Thông báo',
    image: '/images/banner.png',
  };

  const newsItems = [
    {
      title: 'Tuyển sinh khóa học Côn Nhị Khúc mùa Đông 2024',
      excerpt: 'Đăng ký ngay để được tham gia lớp học miễn phí, rèn luyện sức khỏe và kỹ năng tự vệ.',
      date: '05/12/2024',
      category: 'Tuyển sinh',
      image: '/images/logo.png',
    },
    {
      title: 'Lịch tập luyện tuần mới - Cập nhật thường xuyên',
      excerpt: 'Xem lịch tập chi tiết cho các lớp từ cơ bản đến nâng cao, phù hợp với mọi lứa tuổi.',
      date: '03/12/2024',
      category: 'Lịch tập',
      image: '/images/logo.png',
    },
    {
      title: 'Câu chuyện thành viên: Hành trình rèn luyện của học viên',
      excerpt: 'Chia sẻ những câu chuyện truyền cảm hứng từ các học viên đã và đang tập luyện tại CLB.',
      date: '01/12/2024',
      category: 'Câu chuyện',
      image: '/images/logo.png',
    },
    {
      title: 'Kỹ thuật cơ bản: Cách cầm và xoay côn đúng cách',
      excerpt: 'Hướng dẫn chi tiết các kỹ thuật nền tảng giúp người mới bắt đầu an toàn và hiệu quả.',
      date: '28/11/2024',
      category: 'Hướng dẫn',
      image: '/images/logo.png',
    },
  ];

  return (
    <section className="section" id="news" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>
            <span className={styles.labelIcon}>📰</span>
            Tin tức & Sự kiện
          </span>
          <h2 className={styles.sectionTitle}>
            Bài viết <span className={styles.highlight}>nổi bật</span>
          </h2>
          <div className="decorative-line" style={{ margin: '1.5rem auto' }}></div>
          <p className={styles.sectionDescription}>
            Cập nhật tin tức mới nhất về hoạt động, sự kiện và câu chuyện của câu lạc bộ
          </p>
        </motion.div>

        <motion.div
          className={styles.featuredNews}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.featuredImage}>
            <img src={featuredNews.image} alt={featuredNews.title} />
            <div className={styles.featuredBadge}>
              <span>⭐ Nổi bật</span>
            </div>
          </div>
          <div className={styles.featuredContent}>
            <div className={styles.featuredMeta}>
              <span className={styles.category}>{featuredNews.category}</span>
              <span className={styles.date}>📅 {featuredNews.date}</span>
            </div>
            <h3 className={styles.featuredTitle}>{featuredNews.title}</h3>
            <p className={styles.featuredExcerpt}>{featuredNews.excerpt}</p>
            <motion.button
              className={styles.readMoreButton}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              Đọc thêm →
            </motion.button>
          </div>
        </motion.div>

        <div className={styles.newsGrid}>
          {newsItems.map((item, index) => (
            <motion.article
              key={index}
              className={styles.newsCard}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className={styles.newsImage}>
                <img src={item.image} alt={item.title} />
                <span className={styles.newsCategory}>{item.category}</span>
              </div>
              <div className={styles.newsContent}>
                <span className={styles.newsDate}>📅 {item.date}</span>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsExcerpt}>{item.excerpt}</p>
                <motion.a
                  href="#"
                  className={styles.newsLink}
                  whileHover={{ x: 5 }}
                >
                  Xem chi tiết →
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>

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
            Xem tất cả tin tức
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}