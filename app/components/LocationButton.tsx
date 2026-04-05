"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LocationStatus } from "../lib/hooks/useUserLocation";
import styles from "./LocationButton.module.css";

interface LocationButtonProps {
  status: LocationStatus;
  onRequest: () => void;
}

/**
 * Button that prompts the user to share their location.
 * Never auto-requests — only fires on explicit click.
 * Hides itself once location is successfully obtained.
 */
export default function LocationButton({
  status,
  onRequest,
}: LocationButtonProps) {
  const isLoading = status === "loading";
  const hasFailed = status === "denied" || status === "timeout" || status === "error";

  // Once we have location, the banner takes over — hide this button
  if (status === "success") return null;

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
          aria-label="Tìm cơ sở gần bạn dựa trên vị trí"
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Đang xác định vị trí...</span>
            </>
          ) : (
            <>
              <span className={styles.icon} aria-hidden="true">📍</span>
              <span>Tìm cơ sở gần bạn</span>
            </>
          )}
        </motion.button>

        <p className={styles.microcopy}>
          {hasFailed
            ? "⚠️ Không thể truy cập vị trí. Vui lòng chọn cơ sở thủ công."
            : "Chúng tôi chỉ dùng vị trí để đề xuất cơ sở phù hợp nhất"}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
