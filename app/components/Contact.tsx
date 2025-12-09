'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useSubmitContact } from '../lib/hooks/useContact';
import { useCourses } from '../lib/hooks/useCourses';
import styles from './Contact.module.css';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: '',
    message: '',
  });

  // ✅ GỌI API
  const submitMutation = useSubmitContact();
  const { data: courses } = useCourses();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitMutation.mutateAsync({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        courseId: formData.courseId || undefined,
        message: formData.message,
      });
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        courseId: '',
        message: '',
      });
      
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container">
        {/* ... header ... */}

        <div className={styles.contactGrid}>
          {/* ... contact info ... */}

          <motion.form
            className={styles.contactForm}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Họ và tên *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
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
              <label htmlFor="courseId">Khóa học quan tâm</label>
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">Chọn khóa học</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
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
              disabled={submitMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {submitMutation.isPending ? 'Đang gửi...' : 'Gửi thông tin'}
              </span>
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}