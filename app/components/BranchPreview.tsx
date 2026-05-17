'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Wallet, Users, ArrowRight, Map } from 'lucide-react';
import { useBranches } from '@/app/lib/hooks/useBranches';
import type { BranchListItem, BranchCoachSummary } from '@/types/branch';
import styles from './BranchPreview.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_COACH_AVATARS = 3;

function CoachStrip({ coaches }: { coaches: BranchCoachSummary[] }) {
  const visible = coaches.slice(0, MAX_COACH_AVATARS);
  return (
    <div className={styles.coachStrip}>
      <div className={styles.coachAvatars}>
        {visible.map((c, i) => (
          <div
            key={c.coachId}
            className={styles.coachAvatar}
            title={c.fullName}
            style={{ marginLeft: i === 0 ? 0 : '-6px', zIndex: MAX_COACH_AVATARS - i }}
          >
            {c.avatarUrl ? (
              <Image
                src={c.avatarUrl}
                alt={c.fullName}
                width={28}
                height={28}
                className={styles.coachAvatarImg}
              />
            ) : (
              <span className={styles.coachAvatarInitial}>{c.fullName.charAt(0)}</span>
            )}
          </div>
        ))}
      </div>
      <span className={styles.coachLabel}>
        <span className={styles.coachCount}>{coaches.length}</span> HLV
      </span>
    </div>
  );
}

function BranchCard({ branch, index }: { branch: BranchListItem; index: number }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
    >
      {/* Thumbnail */}
      <div className={styles.thumb}>
        {branch.thumbnail ? (
          <Image
            src={branch.thumbnail}
            alt={`Ảnh ${branch.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.thumbImg}
          />
        ) : (
          <div className={styles.thumbPlaceholder}>
            <MapPin size={36} />
          </div>
        )}
        <div className={styles.thumbBadges}>
          {branch.area && <span className={styles.badgeArea}>{branch.area}</span>}
          {branch.isFree && <span className={styles.badgeFree}>Miễn phí</span>}
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.cardName}>{branch.name}</h3>

        <div className={styles.infoList}>
          {branch.address && (
            <div className={styles.infoRow}>
              <MapPin size={13} className={styles.infoIcon} />
              <span className={styles.infoText}>{branch.address}</span>
            </div>
          )}
          {branch.schedule && (
            <div className={styles.infoRow}>
              <Clock size={13} className={styles.infoIcon} />
              <span className={styles.infoText}>{branch.schedule}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <Wallet size={13} className={styles.infoIcon} />
            {branch.isFree ? (
              <span className={styles.feeText}>Miễn phí hoàn toàn</span>
            ) : (
              <span className={styles.infoText}>{branch.fee ?? 'Liên hệ để biết học phí'}</span>
            )}
          </div>
        </div>

        {branch.coaches.length > 0 && <CoachStrip coaches={branch.coaches} />}

        <div className={styles.cardActions}>
          <Link
            href={`/co-so/${branch.id}`}
            className={styles.btnDetail}
            aria-label={`Xem chi tiết ${branch.name}`}
          >
            Xem chi tiết
            <ArrowRight size={13} />
          </Link>
          <Link
            href={`/co-so/${branch.id}#map`}
            className={styles.btnMap}
            aria-label={`Bản đồ ${branch.name}`}
            title="Xem bản đồ"
          >
            <Map size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonThumb} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
      </div>
    </div>
  );
}

export default function BranchPreview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const { data: branches, isLoading, isError } = useBranches();

  const branchCount = branches?.length ?? 0;

  const stats = [
    { Icon: MapPin, value: `${branchCount || 5}`, label: 'Cơ sở tập luyện' },
    { Icon: Users, value: '500+', label: 'Học viên đang luyện tập' },
    { Icon: Clock, value: 'Hàng tuần', label: 'Lịch tập đều đặn' },
  ];

  return (
    <section className={styles.section} id="co-so" ref={ref}>
      <div className="container">

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className={styles.labelRow}>
            <MapPin size={11} className={styles.labelIcon} />
            Hệ thống cơ sở
          </div>

          <h2 className={styles.title}>
            <span className={styles.titleAccent}>{branchCount || 5} Cơ Sở</span> Tập Luyện<br />
            Trên Địa Bàn Hà Nội
          </h2>

          <p className={styles.description}>
            Từ Hà Đông đến Hai Bà Trưng, Bắc Từ Liêm và Hoàng Mai — tìm cơ sở gần bạn nhất
            và bắt đầu hành trình côn nhị khúc ngay hôm nay.
          </p>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          className={styles.statsStrip}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        >
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className={styles.statChip}>
              <Icon size={14} className={styles.statChipIcon} />
              <span className={styles.statChipValue}>{value}</span>
              <span className={styles.statChipLabel}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Branch grid */}
        {isError ? (
          <p className={styles.errorState}>
            Không thể tải danh sách cơ sở. <Link href="/co-so" style={{ color: 'var(--color-primary)' }}>Xem tất cả cơ sở →</Link>
          </p>
        ) : isLoading ? (
          <div className={styles.grid}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className={styles.grid}>
            {(branches ?? []).map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} index={i} />
            ))}
          </div>
        )}

        {/* Bottom actions */}
        <motion.div
          className={styles.bottomRow}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
        >
          <a href="#dang-ky" className={styles.btnPrimary}>
            Đăng ký học thử miễn phí
            <ArrowRight size={16} />
          </a>
          <Link href="/co-so" className={styles.btnSecondary}>
            Xem tất cả cơ sở
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
