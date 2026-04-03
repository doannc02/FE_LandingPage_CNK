"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./Contact.module.css";
import { useSubmitContact } from "../lib/hooks/useContact";
import { useSyncToSheets } from "../lib/hooks/useGoogleSheets"; // ← THÊM
import { useUserLocation } from "../lib/hooks/useUserLocation";
import { useNearestBranch } from "../lib/hooks/useNearestBranch";
import { BRANCHES } from "../lib/data/branches";
import LocationButton from "./LocationButton";
import NearestBranchBanner from "./NearestBranchBanner";

/* =======================
   ANIMATION VARIANTS
======================= */

const formContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const formItemVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
  }),
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    email: "",
    purpose: "",
    trainingType: "",
    location: "",
    message: "",
  });

  const submitMutation = useSubmitContact();
  const syncMutation = useSyncToSheets(); // ← THÊM

  // Location-based branch suggestion — never auto-requests, only on button click
  const [userPickedBranch, setUserPickedBranch] = useState(false);
  const { location, status: locationStatus, requestLocation } = useUserLocation();
  const nearestBranch = useNearestBranch(location);

  // Auto-fill branch when nearest is found, unless user already picked manually
  useEffect(() => {
    if (nearestBranch && !userPickedBranch) {
      setFormData((prev) => ({ ...prev, location: nearestBranch.branch.id }));
    }
  }, [nearestBranch, userPickedBranch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // BƯỚC 1: Submit vào backend database
      console.log("📝 Submitting to backend...");
      const result = await submitMutation.mutateAsync(formData);

      // BƯỚC 2: AUTO-SYNC lên Google Sheets ngay lập tức
      console.log("📊 Auto-syncing to Google Sheets...");
      const now = new Date().toISOString();

      // Không cần await để không block UX
      syncMutation.mutate({
        data: [
          {
            full_name: formData.fullName,
            age: formData.age,
            phone: formData.phone,
            email: formData.email || "",
            purpose: formData.purpose,
            training_type: formData.trainingType,
            location: formData.location,
            message: formData.message || "",
            status: "pending",
            notes: "",
            created_at: (result as any)?.data?.createdAt || now,
            updated_at: now,
          },
        ],
        type: "contact",
        //mode: "append",
      });

      // BƯỚC 3: Reset form
      setFormData({
        fullName: "",
        age: "",
        phone: "",
        email: "",
        purpose: "",
        trainingType: "",
        location: "",
        message: "",
      });
      setUserPickedBranch(false);

      // BƯỚC 4: Thông báo thành công
      alert("🎉 Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    } catch (error) {
      console.error("❌ Submit error:", error);
      alert("❌ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Branch list comes from centralized data (includes lat/lng for suggestion feature)
  const locations = BRANCHES;

  return (
    <section className="section" id="contact">
      <div className="container">
        {/* ================= HEADER ================= */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionLabel}>
            <span className={styles.labelIcon}>📞</span>
            <span>Liên hệ với chúng tôi</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Đăng ký <span className={styles.highlight}>học thử miễn phí</span>
          </h2>
          <p className={styles.sectionDescription}>
            Để lại thông tin, chúng tôi sẽ tư vấn chi tiết lộ trình phù hợp
          </p>
        </motion.div>

        <div className={styles.contactGrid}>
          {/* ================= LEFT: LOCATIONS INFO ================= */}
          <motion.div
            className={styles.contactInfo}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={styles.infoTitle}>Thông tin liên hệ</h3>
            <p className={styles.infoDescription}>
              Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>

            {/* Contact Items */}
            <div className={styles.infoList}>
              <motion.div
                className={styles.infoItem}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={styles.infoIcon}>📱</span>
                <div className={styles.infoContent}>
                  <h4>Hotline</h4>
                  <p>0123 456 789</p>
                  <p>0987 654 321</p>
                </div>
              </motion.div>

              <motion.div
                className={styles.infoItem}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={styles.infoIcon}>✉️</span>
                <div className={styles.infoContent}>
                  <h4>Email</h4>
                  <p>info@connhikhuchadong.vn</p>
                </div>
              </motion.div>

              <motion.div
                className={styles.infoItem}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={styles.infoIcon}>📍</span>
                <div className={styles.infoContent}>
                  <h4>Trụ sở chính</h4>
                  <p>Trường TH Văn Yên, Hà Đông, Hà Nội</p>
                </div>
              </motion.div>
            </div>

            {/* ✅ DANH SÁCH 5 CƠ SỞ */}
            <div className={styles.locationCards}>
              <h4 className={styles.locationTitle}>🏛️ Các cơ sở tập luyện</h4>
              {locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  className={styles.locationCard}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.locationHeader}>
                    <h5>{location.name}</h5>
                    <span
                      className={
                        location.isFree ? styles.freeBadge : styles.paidBadge
                      }
                    >
                      {location.fee}
                    </span>
                  </div>
                  <p className={styles.locationSchedule}>
                    ⏰ {location.schedule}
                  </p>
                  {location.description && (
                    <p className={styles.locationDescription}>
                      📍 {location.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ================= RIGHT: FORM ================= */}
          <motion.form
            className={styles.contactForm}
            onSubmit={handleSubmit}
            variants={formContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-120px" }}
          >
            {/* Form fields... */}
            <motion.div
              className={styles.formGroup}
              variants={formItemVariants}
              custom={-1}
            >
              <label>Họ và tên *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên của bạn"
              />
            </motion.div>

            <div className={styles.formRow}>
              <motion.div
                className={styles.formGroup}
                variants={formItemVariants}
                custom={-1}
              >
                <label>Tuổi *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="5"
                  max="100"
                  placeholder="Tuổi của bạn"
                />
              </motion.div>

              <motion.div
                className={styles.formGroup}
                variants={formItemVariants}
                custom={1}
              >
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </motion.div>
            </div>

            <motion.div
              className={styles.formGroup}
              variants={formItemVariants}
              custom={1}
            >
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
              />
            </motion.div>

            <motion.div
              className={styles.formGroup}
              variants={formItemVariants}
              custom={-1}
            >
              <label>Mục đích học côn *</label>
              <input
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                placeholder="VD: Tăng cường sức khỏe, tự vệ, thi đấu..."
              />
            </motion.div>

            <div className={styles.formRow}>
              <motion.div
                className={styles.formGroup}
                variants={formItemVariants}
                custom={-1}
              >
                <label>Hình thức tham gia *</label>
                <select
                  name="trainingType"
                  value={formData.trainingType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn hình thức</option>
                  <option value="offline">Trực tiếp tại cơ sở</option>
                  <option value="online">Online (video call)</option>
                </select>
              </motion.div>

              <motion.div
                className={styles.formGroup}
                variants={formItemVariants}
                custom={1}
              >
                {/* Label row: title + location button */}
                <div className={styles.labelRow}>
                  <label>Cơ sở tập luyện *</label>
                  <LocationButton
                    status={locationStatus}
                    onRequest={requestLocation}
                  />
                </div>

                {/* Nearest branch banner shown after location obtained */}
                {nearestBranch && (
                  <NearestBranchBanner
                    result={nearestBranch}
                    onChangeBranch={() => setUserPickedBranch(true)}
                  />
                )}

                <div className={styles.selectWrapper}>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={(e) => {
                      setUserPickedBranch(true);
                      handleChange(e);
                    }}
                    required
                    aria-label="Chọn cơ sở tập luyện"
                  >
                    <option value="">Chọn cơ sở</option>
                    {BRANCHES.map((branch) => {
                      const isNearest = nearestBranch?.branch.id === branch.id;
                      return (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} - {branch.fee}
                          {isNearest ? " ★ Gợi ý" : ""}
                        </option>
                      );
                    })}
                  </select>
                  {/* "Gợi ý" badge visible when auto-filled */}
                  {nearestBranch && !userPickedBranch && (
                    <span
                      className={styles.suggestedBadge}
                      title="Hệ thống gợi ý dựa trên vị trí hiện tại của bạn"
                    >
                      Gợi ý
                    </span>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div
              className={styles.formGroup}
              variants={formItemVariants}
              custom={-1}
            >
              <label>Lời nhắn</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Để lại câu hỏi hoặc ghi chú của bạn..."
              />
            </motion.div>

            {/* SUBMIT */}
            <motion.button
              type="submit"
              className={styles.submitButton}
              variants={formItemVariants}
              custom={0}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending
                ? "⏳ Đang gửi..."
                : "🥋 Gửi thông tin đăng ký"}
            </motion.button>

            <motion.p
              className={styles.formNote}
              variants={formItemVariants}
              custom={0}
            >
              💡 <strong>Lưu ý:</strong> 2 cơ sở Hà Đông (Văn Yên & Kiến Hưng)
              MIỄN PHÍ hoàn toàn
            </motion.p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
