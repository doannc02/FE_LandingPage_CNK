'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCoaches } from '../lib/hooks/useCoaches';
import type { CoachDto } from '../lib/api/coaches';
import styles from './CoachesSection.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const TYPE_LABELS: Record<string, string> = {
  HeadCoach: 'Võ sư - HLV trưởng',
  AssistantCoach: 'HLV phụ trách',
};

const FALLBACK_COACHES: CoachDto[] = [
  {
    id: '1',
    userId: null,
    fullName: 'VS Nguyễn Văn Chất',
    title: 'HeadCoach',
    bio: 'Võ sư sáng lập với hơn 13 năm kinh nghiệm huấn luyện côn nhị khúc. Cựu vận động viên thi đấu cấp quốc gia, người truyền cảm hứng cho hàng nghìn học viên.',
    specialization: 'Kỹ thuật biểu diễn, thi đấu chuyên nghiệp',
    yearsOfExperience: 13,
    certifications: ['HLV cấp quốc gia', 'Võ sư đẳng cấp cao'],
    achievements: ['Huy chương vàng toàn quốc', 'HLV xuất sắc 2023'],
    phone: '0868.699.860',
    email: null,
    avatarUrl: null,
    coverImageUrl: null,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    userId: null,
    fullName: 'HLV Trần Văn Hùng',
    title: 'AssistantCoach',
    bio: 'Cựu vận động viên thi đấu 8 năm. Chuyên phụ trách lớp người mới bắt đầu và thiếu niên. Nổi bật với phương pháp giảng dạy kiên nhẫn và tận tâm.',
    specialization: 'Kỹ thuật cơ bản, thiếu niên',
    yearsOfExperience: 8,
    certifications: ['HLV cấp tỉnh/thành'],
    achievements: ['HLV tiêu biểu 2022', '3 năm liên tiếp đạt học viên giỏi'],
    phone: null,
    email: null,
    avatarUrl: null,
    coverImageUrl: null,
    displayOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    userId: null,
    fullName: 'HLV Lê Văn Linh',
    title: 'AssistantCoach',
    bio: 'Chuyên gia kỹ thuật nâng cao và bài quyền biểu diễn. 7 năm kinh nghiệm, từng tham gia nhiều giải đấu cấp thành phố và khu vực.',
    specialization: 'Kỹ thuật nâng cao, bài quyền',
    yearsOfExperience: 7,
    certifications: ['HLV cấp tỉnh/thành'],
    achievements: ['Top 3 giải TP.Hà Nội', 'HLV trẻ xuất sắc'],
    phone: null,
    email: null,
    avatarUrl: null,
    coverImageUrl: null,
    displayOrder: 3,
    isActive: true,
  },
];

function CoachCard({ coach, index }: { coach: CoachDto; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const initials = coach.fullName
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const AVATAR_COLORS = ['#dc2626', '#991b1b', '#b91c1c', '#7f1d1d'];
  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <motion.div
      className={styles.cardWrapper}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
    >
      <div
        className={`${styles.card} ${flipped ? styles.cardFlipped : ''}`}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        {/* FRONT */}
        <div className={styles.cardFront}>
          <div className={styles.avatarWrap}>
            {coach.avatarUrl ? (
              <img src={coach.avatarUrl} alt={coach.fullName} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarFallback} style={{ background: avatarBg }}>
                {initials}
              </div>
            )}
            <div className={styles.avatarGlow} style={{ background: avatarBg }} />
          </div>

          <div className={styles.cardBody}>
            <span className={styles.titleBadge}>
              {TYPE_LABELS[coach.title] ?? coach.title}
            </span>
            <h3 className={styles.name}>{coach.fullName}</h3>
            {coach.specialization && (
              <p className={styles.specialization}>{coach.specialization}</p>
            )}
            <div className={styles.expBadge}>
              <span className={styles.expIcon}>⚡</span>
              <span>{coach.yearsOfExperience} năm kinh nghiệm</span>
            </div>
          </div>

          <div className={styles.hoverHint}>Xem thêm →</div>
        </div>

        {/* BACK */}
        <div className={styles.cardBack} style={{ background: avatarBg }}>
          <h3 className={styles.backName}>{coach.fullName}</h3>

          {coach.bio && <p className={styles.bio}>{coach.bio}</p>}

          {coach.achievements && coach.achievements.length > 0 && (
            <div className={styles.backSection}>
              <span className={styles.backSectionTitle}>🏆 Thành tích</span>
              <ul className={styles.backList}>
                {coach.achievements.slice(0, 3).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {coach.certifications && coach.certifications.length > 0 && (
            <div className={styles.backSection}>
              <span className={styles.backSectionTitle}>📜 Chứng chỉ</span>
              <ul className={styles.backList}>
                {coach.certifications.slice(0, 2).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {coach.phone && (
            <a href={`tel:${coach.phone.replace(/\./g, '')}`} className={styles.backContact}>
              📱 {coach.phone}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CoachesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { data: coaches, isLoading } = useCoaches(true);

  const displayCoaches =
    coaches && coaches.length > 0 ? coaches : FALLBACK_COACHES;

  return (
    <section className={styles.section} id="coaches" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className={styles.eyebrow}>
            <span>👨‍🏫</span> Đội ngũ huấn luyện viên
          </span>
          <h2 className={styles.title}>
            Học từ những người{' '}
            <span className={styles.highlight}>giỏi nhất</span>
          </h2>
          <div className={styles.rule} />
          <p className={styles.subtitle}>
            80% HLV là cựu vận động viên thi đấu chuyên nghiệp — đảm bảo
            kỹ thuật chuẩn mực, tận tâm với từng học viên.
          </p>
        </motion.div>

        {isLoading ? (
          <div className={styles.loading}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {displayCoaches.map((coach, i) => (
              <CoachCard key={coach.id} coach={coach} index={i} />
            ))}
          </div>
        )}

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        >
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🏆</span>
              <span>80% cựu VĐV chuyên nghiệp</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📋</span>
              <span>100% có chứng chỉ HLV</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>❤️</span>
              <span>Tận tâm — cam kết kết quả</span>
            </div>
          </div>
          <a href="#dang-ky" className={styles.cta}>
            Đăng ký học thử với HLV ngay →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
