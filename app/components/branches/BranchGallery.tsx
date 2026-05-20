'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BranchGalleryItem } from '@/types/branch';
import styles from './BranchGallery.module.css';

interface LightboxState {
  open: boolean;
  index: number;
}

interface Props {
  gallery: BranchGalleryItem[];
  branchName: string;
}

export default function BranchGallery({ gallery, branchName }: Props) {
  const imageItems = gallery.filter(item => item.mediaType === 'Image');
  const videoItems = gallery.filter(item => item.mediaType === 'Video');

  const [lb, setLb] = useState<LightboxState>({ open: false, index: 0 });

  const openLightbox = useCallback((index: number) => {
    setLb({ open: true, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLb(prev => ({ ...prev, open: false }));
  }, []);

  const prev = useCallback(() => {
    setLb(prev => ({ open: true, index: Math.max(0, prev.index - 1) }));
  }, []);

  const next = useCallback(() => {
    setLb(prev => ({ open: true, index: Math.min(imageItems.length - 1, prev.index + 1) }));
  }, [imageItems.length]);

  useEffect(() => {
    if (!lb.open) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lb.open, closeLightbox, prev, next]);

  if (gallery.length === 0) return null;

  const currentImage = imageItems[lb.index];

  return (
    <section className={styles.section} aria-labelledby="gallery-heading">
      <div className={styles.sectionHeader}>
        <h2 id="gallery-heading" className={styles.sectionTitle}>Hình Ảnh Cơ Sở</h2>
        <div className={styles.accentLine} />
      </div>

      {imageItems.length > 0 && (
        <div className={styles.imageGrid}>
          {imageItems.map((item, i) => (
            <button
              key={item.id}
              className={styles.imgBtn}
              onClick={() => openLightbox(i)}
              aria-label={item.caption ?? `Ảnh ${i + 1} của ${branchName}`}
            >
              <Image
                src={item.mediaUrl}
                alt={item.caption ?? `Hình ảnh cơ sở ${branchName}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={styles.galleryImg}
              />
            </button>
          ))}
        </div>
      )}

      {videoItems.length > 0 && (
        <div className={styles.videoGrid}>
          {videoItems.map(item => (
            <div key={item.id} className={styles.videoWrap}>
              <video
                src={item.mediaUrl}
                controls
                preload="metadata"
                aria-label={item.caption ?? `Video cơ sở ${branchName}`}
              />
              {item.caption && (
                <div className={styles.videoCaption}>
                  <p className={styles.videoCaptionText}>{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lb.open && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
          className={styles.lightbox}
          onClick={closeLightbox}
        >
          <div
            className={styles.lbInner}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={currentImage.mediaUrl}
              alt={currentImage.caption ?? `Ảnh ${lb.index + 1} của ${branchName}`}
              width={1200}
              height={800}
              className={styles.lbImg}
              priority
            />
            {currentImage.caption && (
              <p className={styles.lbCaption}>{currentImage.caption}</p>
            )}
            <p className={styles.lbCounter}>{lb.index + 1} / {imageItems.length}</p>
          </div>

          <button
            className={styles.lbClose}
            onClick={closeLightbox}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>

          {lb.index > 0 && (
            <button
              className={styles.lbPrev}
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {lb.index < imageItems.length - 1 && (
            <button
              className={styles.lbNext}
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
