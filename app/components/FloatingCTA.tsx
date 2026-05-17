'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Phone, X } from 'lucide-react';
import styles from './FloatingCTA.module.css';

const SCROLL_THRESHOLD = 350;

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('dang-ky');
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Hotline chip */}
          <a
            href="tel:0868699860"
            className={styles.hotlineChip}
            aria-label="Gọi hotline 0868 699 860"
          >
            <Phone size={12} className={styles.hotlineIcon} />
            0868.699.860
          </a>

          {/* Main CTA */}
          <button
            className={styles.btn}
            onClick={scrollToForm}
            aria-label="Đăng ký học thử miễn phí"
          >
            🥋 Đăng ký học thử
            <ArrowRight size={14} />
          </button>

          {/* Dismiss */}
          <button
            className={styles.dismiss}
            onClick={() => setDismissed(true)}
            aria-label="Đóng"
          >
            <X size={10} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
