'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useCourses } from '../lib/hooks/useCourses';
import styles from './Courses.module.css';

export default function Courses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // ✅ GỌI API
  const { data: courses, isLoading, error } = useCourses();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'Cơ bản';
      case 'Intermediate': return 'Trung cấp';
      case 'Advanced': return 'Nâng cao';
      case 'Professional': return 'Chuyên nghiệp';
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <section className="section" id="courses">
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--color-gray-light)' }}>
            Đang tải khóa học...
          </p>
        </div>
      </section>
    );
  }

  if (error || !courses) {
    return (
      <section className="section" id="courses">
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--color-primary)' }}>
            Không thể tải danh sách khóa học
          </p>
        </div>
      </section>
    );
  }

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
            Các khóa học được thiết kế phù hợp với từng trình độ
          </p>
        </motion.div>

        <div className={styles.coursesGrid}>
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className={`${styles.courseCard} ${course.isFeatured ? styles.featured : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              {course.isFeatured && (
                <div className={styles.featuredBadge}>
                  <span>⭐ Phổ biến nhất</span>
                </div>
              )}

              <div className={styles.courseHeader}>
                <span className={styles.courseLevel}>{getLevelColor(course.level)}</span>
                <h3 className={styles.courseTitle}>{course.name}</h3>
              </div>

              <div className={styles.courseInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>⏱️</span>
                  <span>{course.durationMonths} tháng</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <span>{course.sessionsPerWeek} buổi/tuần</span>
                </div>
              </div>

              <div className={styles.coursePrice}>
                <span className={styles.priceAmount}>
                  {course.isFree ? 'MIỄN PHÍ' : `${course.price.toLocaleString('vi-VN')}đ`}
                </span>
              </div>

              <ul className={styles.featuresList}>
                {course.features?.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`${styles.enrollButton} ${course.isFeatured ? styles.enrollFeatured : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Đăng ký ngay
              </motion.button>

              <div className={styles.cardAccent}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}