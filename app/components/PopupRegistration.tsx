"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSubmitRegistration } from "../lib/hooks/useRegistration";
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

  const submitMutation = useSubmitRegistration();

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
      alert("🎉 Đăng ký thành công!");
      setIsOpen(false);
    } catch {
      alert("❌ Lỗi, vui lòng thử lại!");
    }
  };

  const locations = [
    { id: "van-yen", name: "Văn Yên - Hà Đông", fee: "Miễn phí" },
    { id: "kien-hung", name: "Kiến Hưng - Hà Đông", fee: "Miễn phí" },
    { id: "thong-nhat", name: "CV Thống Nhất", fee: "300k" },
    { id: "hoa-binh", name: "CV Hòa Bình", fee: "300k" },
    { id: "kim-giang", name: "Kim Giang", fee: "300k" },
  ];

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

                <select
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className={styles.formSelect}
                >
                  <option value="">Cơ sở *</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
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
