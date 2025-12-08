'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './About.module.css';

export default function About() {
  const ref = useRef(null);
  // QUAN TRỌNG: Bỏ once: true để animation chạy lại mỗi lần scroll vào view
  const isInView = useInView(ref, { amount: 0.3 });

  const features = [
    {
      icon: '🎯',
      title: 'Kỹ thuật chuẩn mực',
      description: 'Đào tạo theo phương pháp truyền thống kết hợp hiện đại, đảm bảo kỹ thuật chính xác và an toàn.',
    },
    {
      icon: '💪',
      title: 'Rèn luyện thể chất',
      description: 'Phát triển toàn diện sức mạnh, sự linh hoạt, phản xạ và khả năng phối hợp cơ thể.',
    },
    {
      icon: '🧠',
      title: 'Rèn luyện tinh thần',
      description: 'Xây dựng sự tự tin, kỷ luật, kiên trì và tinh thần chiến đấu không bỏ cuộc.',
    },
    {
      icon: '🏆',
      title: 'Thi đấu chuyên nghiệp',
      description: 'Cơ hội tham gia các giải thi đấu cấp quận, thành phố và cả nước.',
    },
  ];

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container">
        <div className={styles.aboutGrid}>
          <motion.div
            className={styles.aboutContent}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className={styles.sectionLabel}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <span className={styles.labelIcon}>⚔</span>
              <span>Về chúng tôi</span>
            </motion.div>

            <motion.h2
              className={styles.aboutTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3 }}
            >
              Câu lạc bộ Côn Nhị Khúc <span className={styles.highlight}>Hà Đông</span>
            </motion.h2>

            <motion.div
              className="decorative-line"
              initial={{ width: 0 }}
              animate={isInView ? { width: 80 } : { width: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />

            <motion.p
              className={styles.aboutDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
            >
              Câu lạc bộ Côn Nhị Khúc Hà Đông được thành lập với sứ mệnh truyền bá và phát triển
              bộ môn võ thuật truyền thống đầy nghệ thuật và uy lực này. Chúng tôi tự hào là nơi
              hội tụ của những người yêu thích võ thuật, mong muốn rèn luyện cả thể chất lẫn tinh thần.
            </motion.p>

            <motion.p
              className={styles.aboutDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              Với đội ngũ huấn luyện viên giàu kinh nghiệm và phương pháp đào tạo khoa học, chúng tôi
              cam kết mang đến cho học viên những giá trị đích thực về nghệ thuật côn nhị khúc.
            </motion.p>

            <motion.div
              className={styles.aboutStats}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7 }}
            >
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>2013</span>
                  <span className={styles.statText}>Năm thành lập</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>500+</span>
                  <span className={styles.statText}>Học viên</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.featuresGrid}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(196, 30, 58, 0.2)',
                }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.featureAccent}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className={styles.decorativeElement}>
        <motion.div
          className={styles.floatingShape}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </section>
  );
}