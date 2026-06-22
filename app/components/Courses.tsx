'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useCourses } from '../lib/hooks/useCourses';
import type { Course } from '../lib/api/course';
import styles from './Courses.module.css';

const FALLBACK_COURSES: Course[] = [
  {
    id: 'f1',
    name: 'Khóa Cơ Bản',
    slug: 'co-ban',
    description: 'Dành cho người mới bắt đầu, chưa có kinh nghiệm võ thuật.',
    level: 'Beginner',
    durationMonths: 3,
    sessionsPerWeek: 3,
    price: 800000,
    isFree: false,
    isFeatured: false,
    isActive: true,
    features: [
      'Tư thế & di chuyển cơ bản',
      'Kỹ thuật cầm côn an toàn',
      'Bài quyền đơn giản đầu tiên',
      'Rèn luyện thể lực nền tảng',
      'Lớp học thử 1 buổi MIỄN PHÍ',
    ],
  },
  {
    id: 'f2',
    name: 'Khóa Trung Cấp',
    slug: 'trung-cap',
    description: 'Nâng cao kỹ thuật, học bài quyền nâng cao và chuẩn bị thi đấu.',
    level: 'Intermediate',
    durationMonths: 6,
    sessionsPerWeek: 3,
    price: 1200000,
    isFree: false,
    isFeatured: true,
    isActive: true,
    features: [
      'Bài quyền nâng cao (10+ bài)',
      'Kỹ thuật xoay côn điêu luyện',
      'Kết hợp côn với di chuyển',
      'Chuẩn bị thi đấu cấp quận',
      'Cam kết kết quả — học lại miễn phí',
      'Theo dõi tiến độ cá nhân mỗi tháng',
    ],
  },
  {
    id: 'f3',
    name: 'Khóa Nâng Cao',
    slug: 'nang-cao',
    description: 'Dành cho học viên đã qua trung cấp, hướng tới thi đấu chuyên nghiệp.',
    level: 'Advanced',
    durationMonths: 12,
    sessionsPerWeek: 4,
    price: 1800000,
    isFree: false,
    isFeatured: false,
    isActive: true,
    features: [
      'Kỹ thuật biểu diễn chuyên nghiệp',
      'Chiến thuật thi đấu cấp thành phố',
      'Huấn luyện 1-1 với VS Nguyễn Văn Chất',
      'Dự án thi đấu quốc gia',
      'Chứng chỉ HLV cơ sở',
    ],
  },
];

export default function Courses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: apiCourses } = useCourses();

  const courses = (apiCourses && apiCourses.length > 0) ? apiCourses : FALLBACK_COURSES;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'Cơ bản';
      case 'Intermediate': return 'Trung cấp';
      case 'Advanced': return 'Nâng cao';
      case 'Professional': return 'Chuyên nghiệp';
      default: return level;
    }
  };

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