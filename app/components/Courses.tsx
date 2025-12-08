'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Courses.module.css';

export default function Courses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const courses = [
    {
      level: 'Cơ bản',
      title: 'Khóa học nhập môn',
      duration: '3 tháng',
      sessions: '2 buổi/tuần',
      price: 'MIỄN PHÍ',
      features: [
        'Làm quen với côn nhị khúc',
        'Kỹ thuật cơ bản',
        'Rèn luyện thể lực',
        'An toàn khi tập luyện',
      ],
      color: 'primary',
    },
    {
      level: 'Nâng cao',
      title: 'Khóa học chuyên sâu',
      duration: '6 tháng',
      sessions: '3 buổi/tuần',
      price: 'MIỄN PHÍ',
      features: [
        'Kỹ thuật nâng cao',
        'Combo và liên hoàn',
        'Chiến thuật đối kháng',
        'Chuẩn bị thi đấu',
      ],
      color: 'secondary',
      featured: true,
    },
    {
      level: 'Chuyên nghiệp',
      title: 'Đào tạo vận động viên',
      duration: '12 tháng',
      sessions: '5 buổi/tuần',
      price: 'MIỄN PHÍ',
      features: [
        'Kỹ thuật thi đấu chuyên nghiệp',
        'Chiến thuật cao cấp',
        'Thể lực chuyên môn hóa',
        'Thi đấu quốc gia',
      ],
      color: 'gold',
    },
  ];

  return (
    <section className="section" id="courses" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>
            <span className={styles.labelIcon}>📚</span>
            Khóa học
          </span>
          <h2 className={styles.sectionTitle}>
            Chương trình đào tạo <span className={styles.highlight}>chất lượng</span>
          </h2>
          <div className="decorative-line" style={{ margin: '1.5rem auto' }}></div>
          <p className={styles.sectionDescription}>
            Các khóa học được thiết kế phù hợp với từng trình độ, từ người mới bắt đầu
            đến vận động viên chuyên nghiệp
          </p>
        </motion.div>

        <div className={styles.coursesGrid}>
          {courses.map((course, index) => (
            <motion.div
              key={index}
              className={`${styles.courseCard} ${course.featured ? styles.featured : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              {course.featured && (
                <div className={styles.featuredBadge}>
                  <span>⭐ Phổ biến nhất</span>
                </div>
              )}

              <div className={styles.courseHeader}>
                <span className={styles.courseLevel}>{course.level}</span>
                <h3 className={styles.courseTitle}>{course.title}</h3>
              </div>

              <div className={styles.courseInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>⏱️</span>
                  <span>{course.duration}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <span>{course.sessions}</span>
                </div>
              </div>

              <div className={styles.coursePrice}>
                <span className={styles.priceAmount}>{course.price}</span>
              </div>

              <ul className={styles.featuresList}>
                {course.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`${styles.enrollButton} ${course.featured ? styles.enrollFeatured : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Đăng ký ngay
              </motion.button>

              <div className={styles.cardAccent}></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.scheduleNote}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className={styles.noteIcon}>ℹ️</div>
          <div className={styles.noteContent}>
            <h4>Lịch tập linh hoạt</h4>
            <p>
              Chúng tôi có nhiều khung giờ tập khác nhau để phù hợp với lịch trình của bạn.
              Liên hệ để được tư vấn chi tiết!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}