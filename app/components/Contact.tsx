'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: 'Quận Hà Đông, Hà Nội',
    },
    {
      icon: '📞',
      title: 'Điện thoại',
      content: '0123 456 789',
    },
    {
      icon: '📧',
      title: 'Email',
      content: 'contact@connhikhuchadong.vn',
    },
    {
      icon: '🕐',
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Chủ nhật: 6:00 - 21:00',
    },
  ];

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>
            <span className={styles.labelIcon}>📬</span>
            Liên hệ
          </span>
          <h2 className={styles.sectionTitle}>
            Đăng ký <span className={styles.highlight}>ngay hôm nay</span>
          </h2>
          <div className="decorative-line" style={{ margin: '1.5rem auto' }}></div>
          <p className={styles.sectionDescription}>
            Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn chi tiết cho bạn
          </p>
        </motion.div>

        <div className={styles.contactGrid}>
          <motion.div
            className={styles.contactInfo}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className={styles.infoTitle}>Thông tin liên hệ</h3>
            <p className={styles.infoDescription}>
              Câu lạc bộ Côn Nhị Khúc Hà Đông luôn sẵn sàng đón nhận học viên mới.
              Hãy liên hệ với chúng tôi để được tư vấn và trải nghiệm buổi học thử miễn phí!
            </p>

            <div className={styles.infoList}>
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className={styles.infoItem}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <div className={styles.infoIcon}>{info.icon}</div>
                  <div className={styles.infoContent}>
                    <h4>{info.title}</h4>
                    <p>{info.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.socialLinks}>
              <h4>Theo dõi chúng tôi</h4>
              <div className={styles.socialIcons}>
                <motion.a
                  href="#"
                  className={styles.socialIcon}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📘
                </motion.a>
                <motion.a
                  href="#"
                  className={styles.socialIcon}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📸
                </motion.a>
                <motion.a
                  href="#"
                  className={styles.socialIcon}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📹
                </motion.a>
                <motion.a
                  href="#"
                  className={styles.socialIcon}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  💬
                </motion.a>
              </div>
            </div>
          </motion.div>

          <motion.form
            className={styles.contactForm}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name">Họ và tên *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="course">Khóa học quan tâm</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
              >
                <option value="">Chọn khóa học</option>
                <option value="basic">Khóa học cơ bản</option>
                <option value="advanced">Khóa học nâng cao</option>
                <option value="professional">Đào tạo chuyên nghiệp</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Lời nhắn</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Để lại lời nhắn hoặc câu hỏi của bạn..."
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className={styles.submitButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Gửi thông tin</span>
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
