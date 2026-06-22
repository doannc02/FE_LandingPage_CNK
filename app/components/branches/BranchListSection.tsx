'use client';

import { useState, useRef, useCallback } from 'react';
import { Map } from 'lucide-react';
import type { BranchListItem } from '@/types/branch';
import BranchCard from './BranchCard';
import BranchMapPanel from './BranchMapPanel';
import styles from './BranchListSection.module.css';

interface Props {
  branches: BranchListItem[];
}

export default function BranchListSection({ branches }: Props) {
  const [selectedId, setSelectedId] = useState<string>(branches[0]?.id ?? '');
  const [showMobileMap, setShowMobileMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const selected = branches.find(b => b.id === selectedId) ?? null;

  const handleMapClick = useCallback((branch: BranchListItem) => {
    setSelectedId(branch.id);
    setShowMobileMap(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  if (branches.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Map size={56} className={styles.emptyIcon} />
        <p className={styles.emptyText}>Chưa có cơ sở nào được công bố.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* ── Left: Scrollable card list ─────────────────────── */}
      <div className={styles.cardSide}>
        <div className={styles.scrollGrid}>
          {branches.map(branch => (
            <BranchCard
              key={branch.id}
              branch={branch}
              isActive={branch.id === selectedId}
              onMapClick={() => handleMapClick(branch)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: Map panel ───────────────────────────────── */}
      <div ref={mapRef} className={styles.mapSide}>
        <div className={styles.mobileHint}>
          <p className={styles.hintText}>
            {showMobileMap
              ? `Đang xem: ${selected?.name ?? ''}`
              : 'Nhấn "Xem bản đồ" trên thẻ để hiển thị'}
          </p>
          {showMobileMap && (
            <button
              className={styles.hideBtn}
              onClick={() => setShowMobileMap(false)}
            >
              Ẩn bản đồ
            </button>
          )}
        </div>

        <div className={showMobileMap ? styles.mapVisible : styles.mapHidden}>
          {selected ? (
            <BranchMapPanel
              branchId={selected.id}
              branchName={selected.name}
              address={selected.address}
              latitude={selected.latitude ?? null}
              longitude={selected.longitude ?? null}
            />
          ) : (
            <div className={styles.mapPlaceholder}>
              <Map size={40} className={styles.placeholderIcon} />
              <p className={styles.placeholderText}>Chọn một cơ sở để xem bản đồ</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
