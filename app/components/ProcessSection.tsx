'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './ProcessSection.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    step: '01',
    icon: '📝',
    title: 'Đăng ký 30 giây',
    desc: 'Điền tên + số điện thoại. Không cần trình độ, không cần chuẩn bị gì. HLV sẽ liên hệ trong vòng 24 giờ để tư vấn cơ sở và lịch học phù hợp nhất.',
    highlight: 'Miễn phí — không ràng buộc',
    color: '#dc2626',
  },
  {
    step: '02',
    icon: '🥋',
    title: 'Học thử buổi đầu',
    desc: 'Đến trực tiếp cơ sở gần nhất, tham gia buổi học thử hoàn toàn miễn phí. Trải nghiệm không gian luyện tập, gặp gỡ HLV và học viên. Không áp lực phải đăng ký thêm.',
    highlight: '100% miễn phí buổi đầu',
    color: '#b91c1c',
  },
  {
    step: '03',
    icon: '🏆',
    title: 'Tiến bộ từng ngày',
    desc: 'Theo lộ trình cá nhân hóa, bạn sẽ thấy kết quả rõ ràng sau 2–3 tuần. Chúng tôi cam kết: nếu chưa đạt mục tiêu sau khóa học — được học lại miễn phí.',
    highlight: 'Cam kết kết quả 100%',
    color: '#991b1b',
  },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className={styles.section} id="process" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className={styles.eyebrow}>
            <span>🗺️</span> Bắt đầu thế nào?
          </span>
          <h2 className={styles.title}>
            Chỉ <span className={styles.highlight}>3 bước đơn giản</span>{' '}
            để bắt đầu
          </h2>
          <div className={styles.rule} />
          <p className={styles.subtitle}>
            Không phức tạp, không rào cản — bạn có thể bắt đầu hành trình
            ngay hôm nay.
          </p>
        </motion.div>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.15, ease: EASE }}
              whileHover={{ y: -6 }}
            >
              {/* Number */}
              <div className={styles.stepNum} style={{ color: step.color }}>
                {step.step}
              </div>

              {/* Icon */}
              <div className={styles.stepIcon}>{step.icon}</div>

              {/* Content */}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>

              {/* Highlight badge */}
              <div className={styles.stepBadge} style={{ borderColor: step.color, color: step.color }}>
                ✓ {step.highlight}
              </div>

              {/* Connector line (not on last) */}
              {i < STEPS.length - 1 && (
                <div className={styles.connector}>→</div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.bottomCta}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        >
          <span className={styles.bottomText}>
            Hàng nghìn học viên đã bắt đầu đúng cách này. Bạn thì sao?
          </span>
          <a href="#dang-ky" className={styles.ctaBtn}>
            <span>🥋</span>
            Bắt đầu ngay — Miễn phí
          </a>
        </motion.div>
      </div>
    </section>
  );
}
