"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./Contact.module.css";
import { useSubmitContact } from "../lib/hooks/useContact";

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
      await submitMutation.mutateAsync(formData);
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
      alert("🎉 Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    } catch {
      alert("❌ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // ✅ DANH SÁCH ĐẦY ĐỦ 5 CƠ SỞ
  const locations = [
    {
      id: "van-yen",
      name: "Cơ sở 1: Trường TH Văn Yên - Hà Đông",
      schedule: "Thứ 2-4-6 | 18:30-20:30",
      fee: "MIỄN PHÍ",
      isFree: true,
      description: "Cơ sở chính, miễn phí hoàn toàn cho mọi lứa tuổi",
    },
    {
      id: "kien-hung",
      name: "Cơ sở 2: Vườn hoa Hàng Bè - Kiến Hưng",
      schedule: "Thứ 3-5-7 | 17:45-19:00",
      fee: "MIỄN PHÍ",
      isFree: true,
      description: "Cơ sở 2 tại Hà Đông, miễn phí hoàn toàn",
    },
    {
      id: "thong-nhat",
      name: "Cơ sở 3: Công viên Thống Nhất - Hai Bà Trưng",
      schedule: "Liên hệ để biết lịch cụ thể",
      fee: "300.000đ/tháng",
      isFree: false,
      description: "Công viên Thống Nhất, quận Hai Bà Trưng",
    },
    {
      id: "hoa-binh",
      name: "Cơ sở 4: Công viên Hòa Bình - Bắc Từ Liêm",
      schedule: "Thứ 3-5-7",
      fee: "300.000đ/tháng",
      isFree: false,
      description: "Công viên Hòa Bình, quận Bắc Từ Liêm",
    },
    {
      id: "kim-giang",
      name: "Cơ sở 5: Kim Giang - Thanh Xuân",
      schedule: "Liên hệ để biết lịch cụ thể",
      fee: "300.000đ/tháng",
      isFree: false,
      description: "Khu vực Kim Giang, quận Thanh Xuân",
    },
  ];

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
            {/* 1 */}
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

            {/* 2 */}
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

            {/* 3 */}
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

            {/* 4 */}
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

            {/* 5 */}
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
                <label>Cơ sở tập luyện *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn cơ sở</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} - {l.fee}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* 6 */}
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
