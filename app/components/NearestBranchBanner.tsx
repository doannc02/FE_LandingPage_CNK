"use client";

import { motion } from "framer-motion";
import type { NearestBranchResult } from "../lib/hooks/useNearestBranch";
import styles from "./NearestBranchBanner.module.css";

interface NearestBranchBannerProps {
  result: NearestBranchResult;
  /** Called when user clicks "Đổi cơ sở" to manually pick a branch */
  onChangeBranch: () => void;
  /** Compact variant for tight spaces like the popup */
  compact?: boolean;
}

/**
 * Displays the nearest branch suggestion after location is obtained.
 * Links to Google Maps for directions.
 */
export default function NearestBranchBanner({
  result,
  onChangeBranch,
  compact = false,
}: NearestBranchBannerProps) {
  const { branch, distance } = result;

  // Google Maps directions URL
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;

  const distanceText =
    distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `~${distance.toFixed(1)} km`;

  return (
    <motion.div
      className={`${styles.banner} ${compact ? styles.compact : ""}`}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="status"
      aria-live="polite"
    >
      {/* Left: info */}
      <div className={styles.content}>
        <span className={styles.pin} aria-hidden="true">📍</span>
        <div className={styles.info}>
          <span className={styles.label}>Cơ sở gần bạn nhất:</span>
          <span className={styles.name}>{branch.shortName}</span>
          <span className={styles.distance}>({distanceText})</span>
        </div>
      </div>

      {/* Right: actions */}
      <div className={styles.actions}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapsLink}
          aria-label={`Xem đường đi tới ${branch.shortName} trên Google Maps`}
        >
          🗺 Đường đi
        </a>
        <button
          type="button"
          onClick={onChangeBranch}
          className={styles.changeBtn}
          aria-label="Chọn cơ sở khác"
        >
          Đổi cơ sở
        </button>
      </div>
    </motion.div>
  );
}
