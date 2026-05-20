import Image from 'next/image';
import { Phone, Mail, Award } from 'lucide-react';
import type { BranchCoachDetail } from '@/types/branch';
import styles from './BranchCoachCard.module.css';

const COACH_TITLE_LABEL: Record<string, string> = {
  HeadCoach: 'HLV Trưởng',
  AssistantCoach: 'HLV Phụ trách',
  '1': 'HLV Trưởng',
  '2': 'HLV Phụ trách',
};

interface Props {
  coach: BranchCoachDetail;
}

export default function BranchCoachCard({ coach }: Props) {
  const titleLabel = COACH_TITLE_LABEL[coach.title] ?? coach.title;
  const isHead = coach.title === 'HeadCoach' || coach.title === '1';

  return (
    <div className={styles.card}>
      {/* Cover */}
      <div className={styles.cover}>
        {coach.coverImageUrl ? (
          <>
            <Image
              src={coach.coverImageUrl}
              alt={`Ảnh bìa của ${coach.fullName}`}
              fill
              className={styles.coverImg}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className={styles.coverOverlay} aria-hidden />
          </>
        ) : (
          <div className={styles.coverDefault} />
        )}
      </div>

      {/* Avatar + title badge */}
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>
          {coach.avatarUrl ? (
            <Image
              src={coach.avatarUrl}
              alt={coach.fullName}
              width={84}
              height={84}
              className={styles.avatarImg}
            />
          ) : (
            <span className={styles.avatarInitial}>{coach.fullName.charAt(0)}</span>
          )}
        </div>
        <span className={`${styles.titleBadge} ${isHead ? styles.titleHead : styles.titleAssistant}`}>
          {titleLabel}
        </span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.nameBlock}>
          <h3 className={styles.name}>{coach.fullName}</h3>
          {coach.specialization && (
            <p className={styles.specialization}>{coach.specialization}</p>
          )}
          {coach.yearsOfExperience > 0 && (
            <p className={styles.experience}>{coach.yearsOfExperience} năm kinh nghiệm</p>
          )}
        </div>

        {coach.bio && (
          <p className={styles.bio}>{coach.bio}</p>
        )}

        {coach.certifications && coach.certifications.length > 0 && (
          <div className={styles.certs}>
            <div className={styles.certsLabel}>
              <Award size={11} className={styles.certIcon} />
              Chứng chỉ
            </div>
            <div className={styles.certsList}>
              {coach.certifications.map(cert => (
                <span key={cert} className={styles.certBadge}>{cert}</span>
              ))}
            </div>
          </div>
        )}

        {(coach.phone || coach.email) && (
          <div className={styles.contact}>
            {coach.phone && (
              <a
                href={`tel:${coach.phone}`}
                className={styles.contactLink}
                aria-label={`Gọi điện cho ${coach.fullName}`}
              >
                <Phone size={13} />
                {coach.phone}
              </a>
            )}
            {coach.email && (
              <a
                href={`mailto:${coach.email}`}
                className={styles.contactLink}
                aria-label={`Gửi email cho ${coach.fullName}`}
              >
                <Mail size={13} />
                {coach.email}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
