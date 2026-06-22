"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Target,
  Dumbbell,
  Brain,
  Trophy,
  CalendarDays,
  Users,
  ArrowRight,
} from "lucide-react";
import styles from "./About.module.css";
import type { TargetAndTransition } from "framer-motion";

// ── Static data ───────────────────────────────────────────────────────────

const features = [
  {
    Icon: Target,
    title: "Kỹ thuật chuẩn mực",
    description:
      "Đào tạo theo phương pháp truyền thống kết hợp hiện đại, đảm bảo kỹ thuật chính xác và an toàn.",
  },
  {
    Icon: Dumbbell,
    title: "Rèn luyện thể chất",
    description:
      "Phát triển toàn diện sức mạnh, sự linh hoạt, phản xạ và khả năng phối hợp cơ thể.",
  },
  {
    Icon: Brain,
    title: "Rèn luyện tinh thần",
    description:
      "Xây dựng sự tự tin, kỷ luật, kiên trì và tinh thần chiến đấu không bỏ cuộc.",
  },
  {
    Icon: Trophy,
    title: "Thi đấu chuyên nghiệp",
    description:
      "Cơ hội tham gia các giải thi đấu cấp quận, thành phố và toàn quốc.",
  },
];

const stats = [
  { Icon: CalendarDays, value: "2013", label: "Năm thành lập" },
  { Icon: Users, value: "500+", label: "Học viên" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Component ─────────────────────────────────────────────────────────────

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  // Animate-in when in view, animate-out when not
  const v = (hidden: TargetAndTransition, visible: TargetAndTransition): TargetAndTransition =>
    isInView ? visible : hidden;

  return (
    <section className={`section ${styles.aboutSection}`} id="about" ref={ref}>
      <div className="container">
        <div className={styles.aboutGrid}>

          {/* ─────────────────────────────────────────
              LEFT — Copy, Stats, CTA
          ───────────────────────────────────────── */}
          <motion.div
            className={styles.aboutContent}
            initial={{ opacity: 0, x: -48 }}
            animate={v({ opacity: 0, x: -48 }, { opacity: 1, x: 0 })}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {/* Eyebrow */}
            <motion.div
              className={styles.sectionLabel}
              initial={{ opacity: 0, y: 20 }}
              animate={v({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
            >
              <span className={styles.labelIcon} aria-hidden>⚔</span>
              <span>Về chúng tôi</span>
            </motion.div>

            {/* Heading — {" "} ensures correct word spacing across two renders */}
            <motion.h2
              className={styles.aboutTitle}
              initial={{ opacity: 0, y: 28 }}
              animate={v({ opacity: 0, y: 28 }, { opacity: 1, y: 0 })}
              transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
            >
              Võ đường Côn Nhị Khúc{" "}
              <span className={styles.highlight}>Hà Đông</span>
            </motion.h2>

            {/* Decorative rule */}
            <motion.div
              className={styles.rule}
              initial={{ scaleX: 0 }}
              animate={v({ scaleX: 0 }, { scaleX: 1 })}
              transition={{ duration: 0.6, ease: EASE, delay: 0.38 }}
            />

            {/* Body copy */}
            <motion.p
              className={styles.aboutDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={v({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ duration: 0.55, ease: EASE, delay: 0.45 }}
            >
              Võ đường Côn Nhị Khúc Hà Đông được thành lập với sứ mệnh truyền bá
              và phát triển bộ môn võ thuật truyền thống đầy nghệ thuật và uy
              lực. Chúng tôi tự hào là nơi hội tụ của những người yêu thích
              võ thuật, mong muốn rèn luyện cả thể chất lẫn tinh thần.
            </motion.p>

            <motion.p
              className={styles.aboutDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={v({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ duration: 0.55, ease: EASE, delay: 0.55 }}
            >
              Với đội ngũ huấn luyện viên giàu kinh nghiệm và phương pháp đào
              tạo khoa học, chúng tôi cam kết mang đến cho học viên những giá
              trị đích thực về nghệ thuật côn nhị khúc.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className={styles.aboutStats}
              initial={{ opacity: 0, y: 20 }}
              animate={v({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ duration: 0.55, ease: EASE, delay: 0.65 }}
            >
              {stats.map(({ Icon, value, label }) => (
                <div key={label} className={styles.statCard}>
                  <div className={styles.statIconWrap} aria-hidden>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>{value}</span>
                    <span className={styles.statText}>{label}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={v({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ duration: 0.55, ease: EASE, delay: 0.78 }}
            >
              <a href="#contact" className={styles.ctaButton}>
                <span>Đăng Ký Học Thử Miễn Phí</span>
                <ArrowRight size={17} strokeWidth={2.5} aria-hidden />
              </a>
            </motion.div>
          </motion.div>

          {/* ─────────────────────────────────────────
              RIGHT — Feature cards 2 × 2
          ───────────────────────────────────────── */}
          <motion.div
            className={styles.featuresGrid}
            initial={{ opacity: 0, x: 48 }}
            animate={v({ opacity: 0, x: 48 }, { opacity: 1, x: 0 })}
            transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
          >
            {features.map(({ Icon, title, description }, i) => (
              <motion.div
                key={title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 28 }}
                animate={v({ opacity: 0, y: 28 }, { opacity: 1, y: 0 })}
                transition={{ duration: 0.5, ease: EASE, delay: 0.35 + i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 48px rgba(220, 38, 38, 0.18)",
                }}
              >
                <div className={styles.featureIconWrap} aria-hidden>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDescription}>{description}</p>
                <div className={styles.featureAccent} aria-hidden />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Ambient glow — purely decorative */}
      <div className={styles.decorativeElement} aria-hidden>
        <motion.div
          className={styles.floatingShape}
          animate={{ y: [0, -22, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
