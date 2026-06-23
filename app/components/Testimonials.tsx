'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './Testimonials.module.css';
import { useTestimonials } from '@/app/lib/hooks/useTestimonials';
import type { TestimonialDto } from '@/app/lib/api/testimonials';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  date: string;
  rating: number;
  content: string;
  source: 'Google' | 'Facebook';
  role?: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'f1',
    name: 'Minh Tuấn',
    avatar: 'MT',
    avatarBg: '#dc2626',
    date: '15/11/2024',
    rating: 5,
    content: 'Trước khi học ở đây mình gần như không biết gì về côn nhị khúc. Sau 2 tháng học với thầy Hùng, mình tiến bộ không ngờ. Thầy rất tận tình, không khí lớp thân thiện và thoải mái.',
    source: 'Google',
    role: 'Học viên cơ sở Hà Đông',
  },
  {
    id: 'f2',
    name: 'Thu Hà',
    avatar: 'TH',
    avatarBg: '#9c27b0',
    date: '28/10/2024',
    rating: 5,
    content: 'Con mình học côn nhị khúc tại Võ đường và mình cực kỳ hài lòng. Con tiến bộ rõ rệt sau 3 tháng, đặc biệt là sự tự tin khi biểu diễn trước đám đông. HLV tận tâm, chỉnh sửa từng động tác tỉ mỉ.',
    source: 'Google',
    role: 'Phụ huynh học viên',
  },
  {
    id: 'f3',
    name: 'Hoàng Nam',
    avatar: 'HN',
    avatarBg: '#1d4ed8',
    date: '10/11/2024',
    rating: 5,
    content: 'Mình từng tự học qua video YouTube nhưng mãi không lên được. Đến Võ đường học với thầy Linh mới hiểu ra mình sai ở đâu. Chỉ sau 6 tuần, bạn bè khen mình biểu diễn đẹp hơn nhiều.',
    source: 'Facebook',
    role: 'Học viên cơ sở Kiến Hưng',
  },
  {
    id: 'f4',
    name: 'Phương Linh',
    avatar: 'PL',
    avatarBg: '#059669',
    date: '05/11/2024',
    rating: 5,
    content: 'Là con gái, mình lo lắng không biết có theo kịp không. Nhưng các thầy rất kiên nhẫn, điều chỉnh bài tập phù hợp. Bây giờ mình không chỉ học được côn mà còn tự tin và khỏe mạnh hơn.',
    source: 'Facebook',
    role: 'Học viên nữ — cơ sở Thống Nhất',
  },
  {
    id: 'f5',
    name: 'Đức Việt',
    avatar: 'ĐV',
    avatarBg: '#d97706',
    date: '18/10/2024',
    rating: 5,
    content: 'Mình đăng ký cho con trai 8 tuổi. HLV biết cách tạo không khí vui, các bé học mà cứ như chơi. Chỉ sau 2 tháng, bé đã biểu diễn được một bài quyền hoàn chỉnh. Bé thích lắm!',
    source: 'Google',
    role: 'Phụ huynh — bé 8 tuổi',
  },
  {
    id: 'f6',
    name: 'Mai Anh',
    avatar: 'MA',
    avatarBg: '#db2777',
    date: '25/10/2024',
    rating: 5,
    content: 'Mình học được 4 tháng, đã tham gia giải giao lưu cấp quận. Phương pháp dạy rất khoa học — không chỉ dạy bài quyền mà còn giải thích nguyên lý đằng sau từng động tác.',
    source: 'Google',
    role: 'Học viên nâng cao',
  },
];

function dtoToTestimonial(dto: TestimonialDto): Testimonial {
  const date = new Date(dto.reviewDate);
  const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  return {
    id: dto.id,
    name: dto.authorName,
    avatar: dto.avatarInitials ?? dto.authorName.slice(0, 2).toUpperCase(),
    avatarBg: dto.avatarColor ?? '#dc2626',
    date: formatted,
    rating: dto.rating,
    content: dto.content,
    source: dto.source as 'Google' | 'Facebook',
    role: dto.role ?? undefined,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? styles.starFilled : styles.star}>★</span>
      ))}
    </div>
  );
}

function SourceIcon({ source }: { source: 'Google' | 'Facebook' }) {
  if (source === 'Google') {
    return (
      <svg className={styles.sourceIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    );
  }
  return (
    <svg className={styles.sourceIcon} viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg" aria-label="Facebook">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const { data: apiTestimonials } = useTestimonials();

  const testimonials: Testimonial[] =
    apiTestimonials && apiTestimonials.length > 0
      ? apiTestimonials.map(dtoToTestimonial)
      : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    const handleResize = () => {
      setVisible(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [testimonials.length]);

  const maxIndex = Math.max(0, testimonials.length - visible);
  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section className={styles.section} id="testimonials" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className={styles.eyebrow}>
            <span>💬</span> Học viên nói gì
          </span>
          <h2 className={styles.title}>
            Cảm nhận từ <span className={styles.highlight}>500+ học viên</span>
          </h2>
          <div className={styles.rule} />
          <p className={styles.subtitle}>
            Đánh giá thực từ Google & Facebook — không chỉnh sửa, không dàn dựng.
          </p>
          <div className={styles.aggregateRating}>
            <span className={styles.ratingScore}>4.9</span>
            <div className={styles.ratingStars}>
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} style={{ color: '#f59e0b' }}>{s}</span>
              ))}
            </div>
            <span className={styles.ratingCount}>từ 200+ đánh giá</span>
          </div>
        </motion.div>

        <div className={styles.carouselWrapper}>
          <motion.div
            className={styles.carousel}
            animate={{ x: `calc(-${activeIndex * (100 / visible)}% - ${activeIndex * (16 / visible)}px)` }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                className={styles.card}
                style={{ flex: `0 0 calc(${100 / visible}% - ${(16 * (visible - 1)) / visible}px)` }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + (i % visible) * 0.08, ease: EASE }}
              >
                <div className={styles.quoteIcon}>"</div>
                <div className={styles.cardTop}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatar} style={{ background: t.avatarBg }}>{t.avatar}</div>
                    <div>
                      <div className={styles.name}>{t.name}</div>
                      {t.role && <div className={styles.role}>{t.role}</div>}
                    </div>
                  </div>
                  <div className={styles.meta}>
                    <StarRating rating={t.rating} />
                    <span className={styles.date}>{t.date}</span>
                  </div>
                </div>
                <p className={styles.content}>{t.content}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.source}>
                    <SourceIcon source={t.source} />
                    <span className={styles.sourceName}>{t.source}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className={styles.controls}>
          <button
            className={`${styles.navBtn} ${activeIndex === 0 ? styles.navBtnDisabled : ''}`}
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Trước"
          >←</button>
          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            className={`${styles.navBtn} ${activeIndex === maxIndex ? styles.navBtnDisabled : ''}`}
            onClick={next}
            disabled={activeIndex === maxIndex}
            aria-label="Tiếp"
          >→</button>
        </div>
      </div>
      <div className={styles.bgDecoration} aria-hidden />
    </section>
  );
}
