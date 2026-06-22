"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LocationStatus } from "../lib/hooks/useUserLocation";
import styles from "./LocationButton.module.css";

interface LocationButtonProps {
  status: LocationStatus;
  onRequest: () => void;
}

/**
 * Button that prompts the user to share their GPS location.
 * When IP-based location is already active, renders as an "upgrade to GPS" button.
 * Never auto-requests GPS — only fires on explicit click.
 */
export default function LocationButton({ status, onRequest }: LocationButtonProps) {
  const isLoading = status === "loading";
  const isIpBased = status === "ip-success";
  const hasFailed = status === "denied" || status === "timeout" || status === "error";

  // Hide when GPS confirmed (most precise) or while IP is loading silently in background
  if (status === "success" || status === "ip-loading") return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
      >
        <motion.button
          type="button"
          onClick={onRequest}
          disabled={isLoading}
          className={styles.button}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.97 } : {}}
          transition={{ duration: 0.15 }}
          aria-label={
            isIpBased
              ? "Dùng GPS để xác định vị trí chính xác hơn"
              : "Tìm cơ sở gần bạn dựa trên vị trí"
          }
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Đang xác định vị trí...</span>
            </>
          ) : isIpBased ? (
            <>
              <span className={styles.icon} aria-hidden="true">🎯</span>
              <span>Dùng GPS chính xác hơn</span>
            </>
          ) : (
            <>
              <span className={styles.icon} aria-hidden="true">📍</span>
              <span>Tìm cơ sở gần bạn</span>
            </>
          )}
        </motion.button>

        <p className={styles.microcopy}>
          {isIpBased
            ? "Đang dùng vị trí gần đúng theo mạng — GPS sẽ chính xác hơn"
            : hasFailed
              ? "⚠️ Không thể truy cập vị trí. Vui lòng chọn cơ sở thủ công."
              : "Chúng tôi chỉ dùng vị trí để đề xuất cơ sở phù hợp nhất"}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
