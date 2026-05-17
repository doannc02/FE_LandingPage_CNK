import Link from 'next/link';
import { MapPin, Users, Calendar } from 'lucide-react';
import { getBranches } from '@/app/lib/api/branches';
import BranchListSection from '@/app/components/branches/BranchListSection';
import styles from './CoSo.module.css';

export const metadata = {
  title: 'Hệ Thống Cơ Sở | Võ Đường Côn Nhị Khúc Hà Đông',
  description:
    'Danh sách các cơ sở tập luyện của Võ Đường Côn Nhị Khúc Hà Đông. Tìm cơ sở gần nhất và đăng ký học ngay.',
};

export default async function BranchesPage() {
  const branches = await getBranches().catch(() => []);
  const YEARS_ACTIVE = new Date().getFullYear() - 2013;

  const heroStats = [
    { Icon: MapPin, value: `${branches.length}`, label: 'Cơ sở' },
    { Icon: Users, value: '500+', label: 'Học viên' },
    { Icon: Calendar, value: `${YEARS_ACTIVE}+`, label: 'Năm hoạt động' },
  ];

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <div className={styles.heroInner}>

          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Cơ Sở</span>
          </nav>

          <div className={styles.heroLabel}>
            <MapPin size={12} />
            Hệ thống cơ sở
          </div>

          <h1 className={styles.heroTitle}>
            Cơ Sở{' '}
            <span className={styles.heroAccent}>Võ Đường</span>
          </h1>

          <p className={styles.heroDesc}>
            Võ Đường Côn Nhị Khúc Hà Đông hiện có nhiều cơ sở tập luyện trên địa bàn Hà Nội —
            từ miễn phí đến chuyên nghiệp, phù hợp với mọi đối tượng.
          </p>

          <div className={styles.statsRow}>
            {heroStats.map(({ Icon, value, label }) => (
              <div key={label} className={styles.statChip}>
                <Icon size={15} className={styles.statIcon} />
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Branch list + map ────────────────────────────────── */}
      <div className={styles.content}>
        {branches.length === 0 ? (
          <div className={styles.emptyWrap}>
            <MapPin size={52} className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              Không thể tải dữ liệu cơ sở. Vui lòng thử lại sau.
            </p>
            <Link href="/co-so" className={styles.emptyRetry}>
              Thử lại
            </Link>
          </div>
        ) : (
          <BranchListSection branches={branches} />
        )}
      </div>
    </div>
  );
}
