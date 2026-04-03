"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSubmitRegistration } from "../lib/hooks/useRegistration";
import { useUserLocation } from "../lib/hooks/useUserLocation";
import { useNearestBranch } from "../lib/hooks/useNearestBranch";
import { BRANCHES } from "../lib/data/branches";
import LocationButton from "./LocationButton";
import NearestBranchBanner from "./NearestBranchBanner";
import styles from "./PopupRegistration.module.css";

interface RegistrationFormData {
  fullName: string;
  age: string;
  phone: string;
  purpose: string;
  trainingType: "online" | "offline" | "";
  location: string;
}

export default function PopupRegistration() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    age: "",
    phone: "",
    purpose: "",
    trainingType: "",
    location: "",
  });

  // Track whether user has manually picked a branch — prevents auto-override
  const [userPickedBranch, setUserPickedBranch] = useState(false);

  const submitMutation = useSubmitRegistration();

  // Location hooks — requestLocation is only called on button click, never on mount
  const { location, status: locationStatus, requestLocation } = useUserLocation();
  const nearestBranch = useNearestBranch(location);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  useEffect(() => {
    if (hasShown) return;
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      if (scrollPercentage >= 33) {
        setIsOpen(true);
        setHasShown(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

  // Auto-fill location with nearest branch only if user hasn't manually picked one
  useEffect(() => {
    if (nearestBranch && !userPickedBranch) {
      setFormData((prev) => ({ ...prev, location: nearestBranch.branch.id }));
    }
  }, [nearestBranch, userPickedBranch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMutation.mutateAsync(formData);
      setFormData({
        fullName: "",
        age: "",
        phone: "",
        purpose: "",
        trainingType: "",
        location: "",
      });
      setUserPickedBranch(false);
      alert("🎉 Đăng ký thành công!");
      setIsOpen(false);
    } catch {
      alert("❌ Lỗi, vui lòng thử lại!");
    }
  };

  // When user clicks "Đổi cơ sở" in the banner → focus select + allow manual pick
  const handleChangeBranch = () => {
    setUserPickedBranch(true);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className={styles.backdrop}
            style={{ position: "fixed", inset: 0, zIndex: 99998 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={styles.popup}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 99999,
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              ✕
            </button>

            <div className={styles.popupHeader}>
              <h2>ĐĂNG KÝ HỌC THỬ</h2>
              <p className={styles.popupSubtitle}>
                <span className={styles.highlight}>MIỄN PHÍ</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.popupForm}>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Họ và tên *"
                required
                className={styles.formInput}
              />

              <div className={styles.formRow}>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Tuổi *"
                  required
                  min="5"
                  max="100"
                  className={styles.formInput}
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Số điện thoại *"
                  required
                  className={styles.formInput}
                />
              </div>

              <input
                type="text"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                placeholder="Mục đích (sức khỏe, tự vệ, thi đấu...) *"
                required
                className={styles.formInput}
              />

              {/* ── Location suggestion area ─────────────────────────── */}

              {/* Show button when idle/failed (never auto-request) */}
              {(locationStatus === "idle" ||
                locationStatus === "denied" ||
                locationStatus === "timeout" ||
                locationStatus === "error") && (
                <LocationButton
                  status={locationStatus}
                  onRequest={requestLocation}
                />
              )}

              {/* Loading state inline */}
              {locationStatus === "loading" && (
                <LocationButton
                  status={locationStatus}
                  onRequest={requestLocation}
                />
              )}

              {/* Nearest branch banner (compact for popup) */}
              {nearestBranch && (
                <NearestBranchBanner
                  result={nearestBranch}
                  onChangeBranch={handleChangeBranch}
                  compact
                />
              )}

              {/* ── Form selects ──────────────────────────────────────── */}
              <div className={styles.formRow}>
                <select
                  value={formData.trainingType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trainingType: e.target.value as "online" | "offline",
                    })
                  }
                  required
                  className={styles.formSelect}
                >
                  <option value="">Hình thức *</option>
                  <option value="offline">Trực tiếp</option>
                  <option value="online">Online</option>
                </select>

                {/* Branch select — auto-filled when nearest branch is found */}
                <div className={styles.selectWrapper}>
                  <select
                    value={formData.location}
                    onChange={(e) => {
                      // Mark as manually picked so we don't override it
                      setUserPickedBranch(true);
                      setFormData({ ...formData, location: e.target.value });
                    }}
                    required
                    className={styles.formSelect}
                    aria-label="Chọn cơ sở tập luyện"
                  >
                    <option value="">Cơ sở *</option>
                    {BRANCHES.map((branch) => {
                      const isNearest =
                        nearestBranch?.branch.id === branch.id;
                      return (
                        <option key={branch.id} value={branch.id}>
                          {branch.shortName}
                          {isNearest ? " ★" : ""}
                        </option>
                      );
                    })}
                  </select>
                  {/* Tooltip-style badge for nearest branch */}
                  {nearestBranch && !userPickedBranch && (
                    <span className={styles.suggestedBadge} title="Hệ thống gợi ý dựa trên vị trí hiện tại của bạn">
                      Gợi ý
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className={styles.submitButton}
              >
                {submitMutation.isPending ? "Đang gửi..." : "🥋 ĐĂNG KÝ NGAY"}
              </button>

              <p className={styles.footerNote}>
                💡 <strong>2 cơ sở Hà Đông MIỄN PHÍ</strong>
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
