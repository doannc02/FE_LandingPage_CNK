'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './FAQSection.module.css';
import { useFaqs } from '@/app/lib/hooks/useFaqs';
import type { FaqDto } from '@/app/lib/api/faqs';

const EASE = [0.22, 1, 0.36, 1] as const;

interface FAQ {
  q: string;
  a: string;
  tag?: string;
}

const FALLBACK_FAQS: FAQ[] = [
  {
    q: 'Tôi chưa biết gì về võ thuật, có học được không?',
    a: 'Hoàn toàn được! Hầu hết học viên của chúng tôi đều bắt đầu từ con số 0. Chương trình được thiết kế từ cơ bản nhất, và HLV sẽ theo sát từng bước đi của bạn.',
    tag: 'Người mới',
  },
  {
    q: 'Học phí bao nhiêu? Có thực sự miễn phí không?',
    a: 'Có! Hai cơ sở tại Hà Đông hoàn toàn MIỄN PHÍ. Ba cơ sở còn lại có học phí 300.000đ/tháng. Bạn được học thử 1 buổi miễn phí trước khi quyết định.',
    tag: 'Học phí',
  },
  {
    q: 'Lịch tập có phù hợp với người đi làm/đi học không?',
    a: 'Chúng tôi có lịch tập buổi tối (17:45–21:00) các ngày trong tuần, phù hợp với học sinh, sinh viên và người đi làm.',
    tag: 'Lịch học',
  },
  {
    q: 'Độ tuổi nào phù hợp để học côn nhị khúc?',
    a: 'Từ 6 tuổi trở lên đều có thể học! Chúng tôi có các lớp phân theo độ tuổi: thiếu nhi (6–12), thiếu niên (13–17), và người lớn (18+).',
    tag: 'Độ tuổi',
  },
  {
    q: 'Côn nhị khúc có nguy hiểm không?',
    a: 'An toàn là ưu tiên số 1. Học viên học với côn tập làm từ xốp mềm trong giai đoạn đầu. Trong 13 năm hoạt động, chưa có học viên nào bị chấn thương nghiêm trọng.',
    tag: 'An toàn',
  },
];

function faqFromDto(dto: FaqDto): FAQ {
  return { q: dto.question, a: dto.answer, tag: dto.tag ?? undefined };
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`${styles.item} ${open ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
    >
      <button
        className={styles.question}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={styles.questionText}>{faq.q}</span>
        <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`}>＋</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className={styles.answerInner}>{faq.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { data: apiFaqs } = useFaqs();

  const faqs: FAQ[] =
    apiFaqs && apiFaqs.length > 0
      ? apiFaqs.map(faqFromDto)
      : FALLBACK_FAQS;

  const tags = [...new Set(faqs.map((f) => f.tag).filter(Boolean))] as string[];

  return (
    <section className={styles.section} id="faq" ref={ref}>
      <div className="container">
        <div className={styles.inner}>
          {/* Left: header + CTA */}
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <span className={styles.eyebrow}>
              <span>❓</span> Câu hỏi thường gặp
            </span>
            <h2 className={styles.title}>
              Giải đáp mọi <span className={styles.highlight}>thắc mắc</span>
            </h2>
            <div className={styles.rule} />
            <p className={styles.subtitle}>
              Những câu hỏi phổ biến nhất từ học viên trước khi quyết định
              bước vào hành trình.
            </p>

            {tags.length > 0 && (
              <div className={styles.quickTags}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            <div className={styles.ctaBox}>
              <p className={styles.ctaBoxText}>Còn câu hỏi khác? Liên hệ trực tiếp:</p>
              <a href="tel:0868699860" className={styles.phone}>📱 0868.699.860</a>
              <a href="#dang-ky" className={styles.ctaBtn}>Đăng ký tư vấn miễn phí →</a>
            </div>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          >
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
