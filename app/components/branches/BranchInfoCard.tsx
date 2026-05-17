import { MapPin, Clock, Wallet, FileText, type LucideIcon } from 'lucide-react';
import type { BranchDetail } from '@/types/branch';
import styles from './BranchInfoCard.module.css';

interface Props {
  branch: BranchDetail;
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.iconWrap}>
        <Icon size={15} />
      </div>
      <div className={styles.infoContent}>
        <p className={styles.infoLabel}>{label}</p>
        <div className={styles.infoValue}>{children}</div>
      </div>
    </div>
  );
}

export default function BranchInfoCard({ branch }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Thông tin cơ sở</h2>

      {branch.address && (
        <InfoRow icon={MapPin} label="Địa chỉ">
          {branch.address}
        </InfoRow>
      )}

      {branch.schedule && (
        <InfoRow icon={Clock} label="Lịch tập">
          {branch.schedule}
        </InfoRow>
      )}

      <InfoRow icon={Wallet} label="Học phí">
        {branch.isFree ? (
          <div className={styles.feeRow}>
            <span className={styles.feeValue}>Miễn phí</span>
            <span className={styles.freeBadge}>FREE</span>
          </div>
        ) : (
          <span>{branch.fee ?? 'Liên hệ để biết học phí'}</span>
        )}
      </InfoRow>

      {branch.description && (
        <InfoRow icon={FileText} label="Mô tả">
          <p className={styles.description}>{branch.description}</p>
        </InfoRow>
      )}
    </div>
  );
}
