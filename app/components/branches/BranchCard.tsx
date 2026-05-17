'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Wallet, Navigation } from 'lucide-react';
import type { BranchListItem, BranchCoachSummary } from '@/types/branch';
import styles from './BranchCard.module.css';

const COACH_TITLE: Record<string, string> = {
  HeadCoach: 'HLV Trưởng',
  AssistantCoach: 'HLV Phụ trách',
  '1': 'HLV Trưởng',
  '2': 'HLV Phụ trách',
};

const MAX_AVATARS = 3;

function CoachAvatarStack({ coaches }: { coaches: BranchCoachSummary[] }) {
  const visible = coaches.slice(0, MAX_AVATARS);
  const extra = coaches.length - MAX_AVATARS;
  const head = coaches.find(c => c.title === 'HeadCoach' || c.title === '1');

  return (
    <div className={styles.coachRow}>
      <div className={styles.avatarStack}>
        {visible.map((c, i) => (
          <div
            key={c.coachId}
            className={styles.avatar}
            title={`${c.fullName} — ${COACH_TITLE[c.title] ?? c.title}`}
            style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: MAX_AVATARS - i }}
          >
            {c.avatarUrl ? (
              <Image
                src={c.avatarUrl}
                alt={c.fullName}
                width={32}
                height={32}
                className={styles.avatarImg}
              />
            ) : (
              <span className={styles.avatarInitial}>{c.fullName.charAt(0)}</span>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div className={styles.avatarExtra} style={{ marginLeft: '-8px' }}>
            <span className={styles.avatarExtraText}>+{extra}</span>
          </div>
        )}
      </div>

      {head && (
        <div className={styles.coachMeta}>
          <p className={styles.coachLabel}>HLV Trưởng</p>
          <p className={styles.coachName}>{head.fullName}</p>
        </div>
      )}
    </div>
  );
}

interface Props {
  branch: BranchListItem;
  isActive: boolean;
  onMapClick: () => void;
}

export default function BranchCard({ branch, isActive, onMapClick }: Props) {
  return (
    <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.accentBar} aria-hidden />

      {isActive && (
        <div className={styles.activeBadge}>
          <span className={styles.activeDot} />
          <span className={styles.activeBadgeText}>Đang xem</span>
        </div>
      )}

      <div className={styles.thumbnail}>
        {branch.thumbnail ? (
          <Image
            src={branch.thumbnail}
            alt={`Ảnh đại diện cơ sở ${branch.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className={styles.thumbnailImg}
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <MapPin size={40} />
          </div>
        )}
        <div className={styles.badges}>
          {branch.area && <span className={styles.badgeArea}>{branch.area}</span>}
          {branch.isFree && <span className={styles.badgeFree}>Miễn phí</span>}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{branch.name}</h3>

        <div className={styles.infoList}>
          {branch.address && (
            <div className={styles.infoRow}>
              <MapPin size={14} className={styles.infoIcon} />
              <span className={styles.infoText}>{branch.address}</span>
            </div>
          )}
          {branch.schedule && (
            <div className={styles.infoRow}>
              <Clock size={14} className={styles.infoIcon} />
              <span className={styles.infoText}>{branch.schedule}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <Wallet size={14} className={styles.infoIcon} />
            {branch.isFree ? (
              <span className={styles.feeText}>Miễn phí</span>
            ) : (
              <span className={styles.infoText}>{branch.fee ?? 'Liên hệ để biết học phí'}</span>
            )}
          </div>
        </div>

        {branch.coaches.length > 0 && <CoachAvatarStack coaches={branch.coaches} />}

        <div className={styles.actions}>
          <button
            onClick={onMapClick}
            className={styles.btnMap}
            aria-label={`Xem bản đồ cơ sở ${branch.name}`}
          >
            <Navigation size={13} />
            Xem bản đồ
          </button>
          <Link
            href={`/co-so/${branch.id}`}
            className={styles.btnDetail}
            aria-label={`Xem chi tiết cơ sở ${branch.name}`}
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
