'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAchievements } from '../lib/hooks/useAchievements';
import type { AchievementDto } from '../lib/api/achievements';
import styles from './AchievementsSection.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const TYPE_CONFIG: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  Competition: { icon: '🏆', label: 'Thi đấu', color: '#f59e0b' },
  Certification: { icon: '📜', label: 'Chứng nhận', color: '#3b82f6' },
  Milestone: { icon: '🎯', label: 'Cột mốc', color: '#10b981' },
  Award: { icon: '🥇', label: 'Giải thưởng', color: '#dc2626' },
};

const FALLBACK: AchievementDto[] = [
  {
    id: '1',
    title: 'Huy chương Vàng — Giải Côn Nhị Khúc Toàn Quốc 2023',
    description: 'Học viên Võ đường đạt huy chương vàng tại giải thi đấu côn nhị khúc toàn quốc, khẳng định chất lượng đào tạo hàng đầu.',
    achievementDate: '2023-11-15',
    type: 'Competition',
    imageUrl: null,
    videoUrl: null,
    coachId: null,
    participantNames: ['Nguyễn Văn A', 'Trần Thị B'],
    displayOrder: 1,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Nhất — Giải Võ Thuật Hà Nội Mở Rộng 2023',
    description: 'Đội tuyển Võ đường giành vị trí nhất toàn đoàn tại giải Hà Nội mở rộng với 5 huy chương vàng, 3 bạc, 2 đồng.',
    achievementDate: '2023-08-20',
    type: 'Award',
    imageUrl: null,
    videoUrl: null,
    coachId: null,
    participantNames: null,
    displayOrder: 2,
    isFeatured: true,
  },
  {
    id: '3',
    title: '500+ Học viên hoàn thành khóa học — 2023',
    description: 'Cột mốc quan trọng khi Võ đường đào tạo thành công hơn 500 học viên đạt chuẩn kỹ thuật trong năm 2023.',
    achievementDate: '2023-12-31',
    type: 'Milestone',
    imageUrl: null,
    videoUrl: null,
    coachId: null,
    participantNames: null,
    displayOrder: 3,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Cấp phép HLV Quốc gia — VS Nguyễn Văn Chất',
    description: 'Võ sư trưởng được Liên đoàn Võ thuật Việt Nam cấp chứng chỉ HLV quốc gia, nâng tầm uy tín đào tạo.',
    achievementDate: '2022-06-01',
    type: 'Certification',
    imageUrl: null,
    videoUrl: null,
    coachId: null,
    participantNames: ['VS Nguyễn Văn Chất'],
    displayOrder: 4,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Top 3 — Giải Vô địch Khu vực phía Bắc 2022',
    description: 'Học viên lứa tuổi thiếu niên xuất sắc giành top 3 giải khu vực, khẳng định hiệu quả phương pháp đào tạo trẻ.',
    achievementDate: '2022-09-10',
    type: 'Competition',
    imageUrl: null,
    videoUrl: null,
    coachId: null,
    participantNames: ['Lê Văn C', 'Phạm Thị D'],
    displayOrder: 5,
    isFeatured: true,
  },
  {
    id: '6',
    title: '10 năm hoạt động — Kỷ niệm 2023',
    description: 'Võ đường kỷ niệm 10 năm thành lập với buổi gala biểu diễn quy mô lớn, 200+ học viên tham dự.',
    achievementDate: '2023-03-15',
    type: 'Milestone',
    imageUrl: null,
    videoUrl: null,
    coachId: null,
    participantNames: null,
    displayOrder: 6,
    isFeatured: true,
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
}

function AchievementCard({
  achievement,
  index,
}: {
  achievement: AchievementDto;
  index: number;
}) {
  const cfg = TYPE_CONFIG[achievement.type] ?? TYPE_CONFIG.Award;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(220,38,38,0.14)' }}
    >
      <div className={styles.cardTop}>
        <div className={styles.typeIcon}>{cfg.icon}</div>
        <span className={styles.typeBadge} style={{ color: cfg.color, background: `${cfg.color}18` }}>
          {cfg.label}
        </span>
        <span className={styles.date}>{formatDate(achievement.achievementDate)}</span>
      </div>

      <h3 className={styles.cardTitle}>{achievement.title}</h3>

      {achievement.description && (
        <p className={styles.cardDesc}>{achievement.description}</p>
      )}

      {achievement.participantNames && achievement.participantNames.length > 0 && (
        <div className={styles.participants}>
          <span className={styles.participantLabel}>👤</span>
          <span>{achievement.participantNames.slice(0, 3).join(', ')}</span>
        </div>
      )}

      <div className={styles.cardAccent} style={{ background: cfg.color }} />
    </motion.div>
  );
}

export default function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { data: achievements, isLoading } = useAchievements(true);

  const display =
    achievements && achievements.length > 0 ? achievements : FALLBACK;

  return (
    <section className={styles.section} id="achievements" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className={styles.eyebrow}>
            <span>🏆</span> Thành tích nổi bật
          </span>
          <h2 className={styles.title}>
            Bằng chứng từ{' '}
            <span className={styles.highlight}>thực chiến</span>
          </h2>
          <div className={styles.rule} />
          <p className={styles.subtitle}>
            Những giải thưởng và cột mốc đáng tự hào trong hành trình{' '}
            <strong>13 năm</strong> xây dựng Võ đường.
          </p>
        </motion.div>

        {/* Summary bar */}
        <motion.div
          className={styles.summaryBar}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          {[
            { value: '50+', label: 'Giải thưởng' },
            { value: '13', label: 'Năm hoạt động' },
            { value: '200+', label: 'HCV các cấp' },
            { value: '5', label: 'Cơ sở luyện tập' },
          ].map(({ value, label }) => (
            <div key={label} className={styles.summaryItem}>
              <span className={styles.summaryValue}>{value}</span>
              <span className={styles.summaryLabel}>{label}</span>
            </div>
          ))}
        </motion.div>

        {isLoading ? (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {display.map((a, i) => (
              <AchievementCard key={a.id} achievement={a} index={i} />
            ))}
          </div>
        )}

        <motion.div
          className={styles.footerCta}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        >
          <p>Trở thành phần của những kỳ tích tiếp theo!</p>
          <a href="#dang-ky" className={styles.ctaBtn}>
            Đăng ký học thử miễn phí →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
