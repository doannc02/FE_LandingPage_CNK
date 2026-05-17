import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getBranchById } from '@/app/lib/api/branches';
import BranchInfoCard from '@/app/components/branches/BranchInfoCard';
import BranchMapPanel from '@/app/components/branches/BranchMapPanel';
import BranchCoachCard from '@/app/components/branches/BranchCoachCard';
import BranchGallery from '@/app/components/branches/BranchGallery';
import styles from './CoSoDetail.module.css';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const branch = await getBranchById(params.id).catch(() => null);
  if (!branch) return { title: 'Cơ sở không tồn tại' };
  return {
    title: `${branch.name} | Võ Đường Côn Nhị Khúc`,
    description:
      branch.description ??
      `Thông tin chi tiết cơ sở ${branch.name} của Võ Đường Côn Nhị Khúc Hà Đông.`,
  };
}

export default async function BranchDetailPage({ params }: Props) {
  const branch = await getBranchById(params.id).catch(() => null);
  if (!branch) notFound();

  return (
    <div className={styles.page}>

      {/* ── Hero — full-width thumbnail ───────────────────────── */}
      <div className={styles.heroWrap}>
        {branch.thumbnail ? (
          <Image
            src={branch.thumbnail}
            alt={`Ảnh cơ sở ${branch.name}`}
            fill
            priority
            className={styles.heroImg}
            sizes="100vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--color-gray-100)' }} />
        )}
        <div className={styles.heroOverlay} aria-hidden />

        <div className={styles.heroContent}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/co-so" className={styles.breadcrumbLink}>Cơ Sở</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{branch.name}</span>
          </nav>

          {branch.area && (
            <span className={styles.areaBadge}>{branch.area}</span>
          )}

          <h1 className={styles.heroName}>{branch.name}</h1>

          {branch.address && (
            <div className={styles.heroAddress}>
              <MapPin size={13} className={styles.heroAddressIcon} />
              {branch.address}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className={styles.main}>

        {/* Info + Map */}
        <div className={styles.infoMapGrid}>
          <BranchInfoCard branch={branch} />
          <BranchMapPanel
            branchId={branch.id}
            branchName={branch.name}
            address={branch.address}
            latitude={branch.latitude}
            longitude={branch.longitude}
            prominentDirections
          />
        </div>

        {/* Coaches */}
        {branch.coaches.length > 0 && (
          <section aria-labelledby="coaches-heading">
            <div className={styles.sectionHeading}>
              <h2 id="coaches-heading" className={styles.sectionTitle}>
                Huấn Luyện Viên Cơ Sở
              </h2>
              <div className={styles.sectionAccent} />
            </div>
            <div className={styles.coachGrid}>
              {branch.coaches.map(coach => (
                <BranchCoachCard key={coach.coachId} coach={coach} />
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {branch.gallery.length > 0 && (
          <BranchGallery gallery={branch.gallery} branchName={branch.name} />
        )}

        {/* Back link */}
        <div className={styles.backRow}>
          <Link href="/co-so" className={styles.backLink}>
            <ArrowLeft size={15} />
            Quay lại danh sách cơ sở
          </Link>
        </div>

      </div>
    </div>
  );
}
