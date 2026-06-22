'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BranchGalleryItem } from '@/types/branch';
import styles from './Gallery.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.dangcapnc.io.vn/api').replace(/\/$/, '');

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  mediaType: 'Image' | 'Video';
  branchName?: string;
}

async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch(`${BASE}/branches?isActive=true&pageSize=20`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];

  const json = await res.json();
  const branches = (json?.isSuccess ? json?.data?.items : json?.items) ?? [];

  const items: GalleryItem[] = [];

  await Promise.all(
    (branches as { id: string; name: string }[]).slice(0, 5).map(async (b) => {
      try {
        const detailRes = await fetch(`${BASE}/branches/${b.id}`, { next: { revalidate: 3600 } });
        if (!detailRes.ok) return;
        const detail = await detailRes.json();
        const gallery: BranchGalleryItem[] = detail?.data?.gallery ?? detail?.gallery ?? [];
        gallery.forEach((g) => {
          items.push({
            id: g.id,
            src: g.mediaUrl,
            title: g.caption ?? b.name,
            mediaType: g.mediaType as 'Image' | 'Video',
            branchName: b.name,
          });
        });
      } catch {}
    })
  );

  return items.sort(() => Math.random() - 0.5).slice(0, 12);
}

const FALLBACK_IMAGES: GalleryItem[] = [
  { id: 'f1', src: '/images/banner.png', title: 'Đại gia đình Võ đường CNK Hà Đông', mediaType: 'Image' },
  { id: 'f2', src: '/images/banner.png', title: 'Buổi biểu diễn kỷ niệm 10 năm', mediaType: 'Image' },
  { id: 'f3', src: '/images/banner.png', title: 'Học viên luyện tập côn nhị khúc', mediaType: 'Image' },
  { id: 'f4', src: '/images/banner.png', title: 'Giải thi đấu cấp quận 2023', mediaType: 'Image' },
  { id: 'f5', src: '/images/banner.png', title: 'Lớp học thiếu niên — Hà Đông', mediaType: 'Image' },
  { id: 'f6', src: '/images/banner.png', title: 'HLV và học viên tại cơ sở Thống Nhất', mediaType: 'Image' },
];

function LightboxModal({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      className={styles.lightboxOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.lightboxContent}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.lightboxClose} onClick={onClose} aria-label="Đóng">✕</button>
        <button className={styles.lightboxPrev} onClick={onPrev} aria-label="Ảnh trước">‹</button>
        <button className={styles.lightboxNext} onClick={onNext} aria-label="Ảnh sau">›</button>

        {item.mediaType === 'Video' ? (
          <video src={item.src} controls className={styles.lightboxMedia} />
        ) : (
          <img src={item.src} alt={item.title} className={styles.lightboxMedia} />
        )}

        {item.title && (
          <div className={styles.lightboxCaption}>
            <span>{item.title}</span>
            {item.branchName && <span className={styles.lightboxBranch}>{item.branchName}</span>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { data: apiItems = [], isLoading } = useQuery({
    queryKey: ['gallery-all'],
    queryFn: fetchGallery,
    staleTime: 30 * 60 * 1000,
  });

  const allItems = apiItems.length > 0 ? apiItems : FALLBACK_IMAGES;
  const images = allItems.filter((i) => i.mediaType === 'Image');
  const videos = allItems.filter((i) => i.mediaType === 'Video');
  const activeItems = activeTab === 'images' ? images : videos;
  const displayed = showAll ? activeItems : activeItems.slice(0, 6);

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null)), []);
  const nextLightbox = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? Math.min(displayed.length - 1, i + 1) : null)), [displayed.length]);

  return (
    <section className={styles.section} id="gallery" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className={styles.eyebrow}>
            <span>📸</span> Thư viện
          </span>
          <h2 className={styles.title}>
            Khoảnh khắc <span className={styles.highlight}>đáng nhớ</span>
          </h2>
          <div className={styles.rule} />
          <p className={styles.subtitle}>
            Hình ảnh và video thực tế từ các buổi tập, sự kiện và cuộc thi của Võ đường.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, ease: EASE }}
        >
          <button
            className={`${styles.tab} ${activeTab === 'images' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('images'); setShowAll(false); }}
          >
            <span>📷</span> Hình ảnh {images.length > 0 && `(${images.length})`}
          </button>
          {videos.length > 0 && (
            <button
              className={`${styles.tab} ${activeTab === 'videos' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('videos'); setShowAll(false); }}
            >
              <span>🎥</span> Video ({videos.length})
            </button>
          )}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {displayed.map((item, i) => (
              <motion.div
                key={item.id}
                className={`${styles.item} ${i === 0 ? styles.itemFeatured : ''}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.05 * i, duration: 0.45, ease: EASE }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(i)}
              >
                <div className={styles.mediaWrapper}>
                  {item.mediaType === 'Video' ? (
                    <video src={item.src} className={styles.media} preload="metadata" />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className={styles.media}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.overlay}>
                    <div className={styles.overlayIcon}>
                      {item.mediaType === 'Video' ? '▶' : '🔍'}
                    </div>
                    {item.title && <p className={styles.overlayTitle}>{item.title}</p>}
                  </div>
                  {item.mediaType === 'Video' && (
                    <div className={styles.videoPlayBadge}>▶</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Show more / less */}
        {activeItems.length > 6 && (
          <motion.div
            className={styles.viewAllWrapper}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className={styles.viewAllButton}
              onClick={() => setShowAll((s) => !s)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {showAll
                ? 'Thu gọn'
                : `Xem thêm ${activeItems.length - 6} ${activeTab === 'images' ? 'ảnh' : 'video'}`}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && displayed[lightboxIndex] && (
          <LightboxModal
            item={displayed[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
