'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './FAQSection.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

interface FAQ {
  q: string;
  a: string;
  tag?: string;
}

const FAQS: FAQ[] = [
  {
    q: 'Tôi chưa biết gì về võ thuật, có học được không?',
    a: 'Hoàn toàn được! Hầu hết học viên của chúng tôi đều bắt đầu từ con số 0. Chương trình được thiết kế từ cơ bản nhất, và HLV sẽ theo sát từng bước đi của bạn. Chúng tôi có lớp dành riêng cho người mới bắt đầu, không áp lực, không cần thể lực đặc biệt.',
    tag: 'Người mới',
  },
  {
    q: 'Học phí bao nhiêu? Có thực sự miễn phí không?',
    a: 'Có! Hai cơ sở tại Hà Đông (Văn Yên & Kiến Hưng) hoàn toàn MIỄN PHÍ — không thu bất kỳ khoản nào. Ba cơ sở còn lại (Thống Nhất, Hòa Bình, Kim Giang) có học phí 300.000đ/tháng — thấp hơn 70% so với mặt bằng chung thị trường. Bạn cũng được học thử 1 buổi miễn phí trước khi quyết định.',
    tag: 'Học phí',
  },
  {
    q: 'Lịch tập có phù hợp với người đi làm/đi học không?',
    a: 'Chúng tôi có lịch tập buổi tối (17:45–21:00) các ngày trong tuần, phù hợp với học sinh, sinh viên và người đi làm. Lịch cụ thể: Hà Đông T2-4-6 (18:30–20:30), Kiến Hưng T3-5-7 (17:45–19:00), các cơ sở khác T3-5-7 (19:00–21:00). Bạn có thể chọn cơ sở gần nhất với lịch phù hợp.',
    tag: 'Lịch học',
  },
  {
    q: 'Độ tuổi nào phù hợp để học côn nhị khúc?',
    a: 'Từ 6 tuổi trở lên đều có thể học! Chúng tôi có các lớp phân theo độ tuổi: thiếu nhi (6–12), thiếu niên (13–17), và người lớn (18+). Không có giới hạn tuổi trên — nhiều học viên lớn tuổi học để rèn luyện sức khỏe và tinh thần. HLV sẽ điều chỉnh chương trình phù hợp từng nhóm.',
    tag: 'Độ tuổi',
  },
  {
    q: 'Mất bao lâu để có thể biểu diễn một bài quyền?',
    a: 'Trung bình sau 2–3 tháng luyện tập đều đặn, học viên có thể biểu diễn các bài cơ bản một cách tự tin. Phương pháp "Total Immersion" giúp bạn tiến bộ nhanh hơn 40% so với tự học. Với học viên chuyên tâm, chỉ cần 4–6 tuần để thấy sự thay đổi rõ rệt về kỹ thuật và sự tự tin.',
    tag: 'Tiến độ',
  },
  {
    q: 'Nếu tôi bỏ lỡ nhiều buổi, tôi có bị tụt hậu không?',
    a: 'Không đáng lo! Chúng tôi áp dụng chính sách học bù linh hoạt — bạn có thể học bù ở bất kỳ cơ sở nào trong hệ thống. Ngoài ra, mỗi bài tập đều có video hướng dẫn để bạn ôn luyện tại nhà. HLV sẽ review lại kiến thức bạn bỏ lỡ trong buổi học tiếp theo.',
    tag: 'Linh hoạt',
  },
  {
    q: 'Côn nhị khúc có nguy hiểm không? Con em tôi có bị chấn thương không?',
    a: 'An toàn là ưu tiên số 1. Tất cả học viên đều được học với côn tập làm từ xốp hoặc nhựa mềm trong giai đoạn đầu. Sân tập có thảm bảo vệ đầy đủ. HLV luôn giám sát và không yêu cầu thực hiện kỹ thuật nâng cao khi chưa đủ nền tảng. Trong 13 năm hoạt động, chưa có học viên nào bị chấn thương nghiêm trọng.',
    tag: 'An toàn',
  },
  {
    q: 'Tôi đăng ký rồi nhưng chưa đạt mục tiêu sau khóa học thì sao?',
    a: 'Chúng tôi cam kết 100%: học viên được học lại miễn phí nếu chưa nắm vững kỹ thuật cơ bản sau khi hoàn thành chương trình. Đây không phải marketing — đây là cam kết được ghi rõ khi đăng ký. Đó cũng là lý do 98% học viên hài lòng với kết quả của mình.',
    tag: 'Cam kết',
  },
];

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
        <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`}>
          ＋
        </span>
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

            <div className={styles.quickTags}>
              {['Người mới', 'Học phí', 'Lịch học', 'An toàn', 'Cam kết'].map(
                (tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                )
              )}
            </div>

            <div className={styles.ctaBox}>
              <p className={styles.ctaBoxText}>
                Còn câu hỏi khác? Liên hệ trực tiếp:
              </p>
              <a href="tel:0868699860" className={styles.phone}>
                📱 0868.699.860
              </a>
              <a href="#dang-ky" className={styles.ctaBtn}>
                Đăng ký tư vấn miễn phí →
              </a>
            </div>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          >
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
