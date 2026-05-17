'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { useSubmitContact } from '@/app/lib/hooks/useContact';
import { useSyncToSheets } from '@/app/lib/hooks/useGoogleSheets';
import { BRANCHES } from '@/app/lib/data/branches';
import styles from './CTASection.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const PURPOSES = [
  { value: 'self-defense', label: 'Tự vệ' },
  { value: 'fitness', label: 'Thể dục thể thao' },
  { value: 'sport', label: 'Thi đấu chuyên nghiệp' },
  { value: 'hobby', label: 'Sở thích, giải trí' },
  { value: 'kids', label: 'Cho con em tập' },
];

const BENEFITS = [
  '2 cơ sở Hà Đông hoàn toàn MIỄN PHÍ',
  'HLV được đào tạo bài bản — 80% cựu vận động viên',
  'Cam kết học lại miễn phí nếu chưa đạt mục tiêu',
  'Lịch tập linh hoạt 3 buổi/tuần phù hợp mọi lứa tuổi',
];

const TRUST = [
  { Icon: ShieldCheck, label: '13+ năm kinh nghiệm' },
  { Icon: Clock, label: 'Phản hồi trong 24h' },
];

export default function CTASection() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    purpose: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitContact();
  const syncMutation = useSyncToSheets();

  const isPending = submitMutation.isPending;
  const isValid = formData.fullName.trim() && formData.phone.trim().length >= 9;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;

    try {
      const result = await submitMutation.mutateAsync({
        fullName: formData.fullName,
        phone: formData.phone,
        email: '',
        age: '',
        purpose: formData.purpose,
        trainingType: 'offline',
        location: formData.location,
        message: '',
      });

      const now = new Date().toISOString();
      syncMutation.mutate({
        data: [{
          full_name: formData.fullName,
          age: '',
          phone: formData.phone,
          email: '',
          purpose: formData.purpose,
          training_type: 'offline',
          location: formData.location,
          message: '',
          status: 'pending',
          notes: 'Đăng ký từ CTA Section',
          created_at: (result as { data?: { createdAt?: string } })?.data?.createdAt ?? now,
          updated_at: now,
        }],
        type: 'contact',
      });

      setSubmitted(true);
    } catch {
      alert('Có lỗi xảy ra, vui lòng thử lại hoặc gọi trực tiếp: 0868.699.860');
    }
  };

  return (
    <section className={styles.section} id="dang-ky">
      <div className="container">
        <div className={styles.inner}>

          {/* ── Left: Copy ─────────────────────────────────────── */}
          <motion.div
            className={styles.copy}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <div className={styles.eyebrow}>
              🥋 Đăng ký học thử
            </div>

            <h2 className={styles.headline}>
              Bắt đầu hành trình<br />
              <span className={styles.headlineHighlight}>Miễn phí</span> ngay hôm nay
            </h2>

            <p className={styles.subline}>
              Để lại thông tin để được tư vấn lộ trình luyện tập phù hợp.
              Đội ngũ sẽ liên hệ trong vòng 24 giờ.
            </p>

            <div className={styles.benefits}>
              {BENEFITS.map((text, i) => (
                <motion.div
                  key={i}
                  className={styles.benefit}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE }}
                >
                  <div className={styles.benefitCheck}>✓</div>
                  <span className={styles.benefitText}>{text}</span>
                </motion.div>
              ))}
            </div>

            <div className={styles.trustRow}>
              {TRUST.map(({ Icon, label }) => (
                <div key={label} className={styles.trustBadge}>
                  <Icon size={13} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Form ─────────────────────────────────────── */}
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          >
            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <CheckCircle size={28} />
                </div>
                <p className={styles.successTitle}>Đăng ký thành công! 🎉</p>
                <p className={styles.successText}>
                  Cảm ơn <strong>{formData.fullName}</strong>! Chúng tôi sẽ liên hệ
                  số <strong>{formData.phone}</strong> trong vòng 24 giờ để tư vấn lộ trình
                  phù hợp nhất cho bạn.
                </p>
              </div>
            ) : (
              <>
                <h3 className={styles.formTitle}>
                  Đăng ký <span className={styles.formTitleAccent}>Học Thử Miễn Phí</span>
                </h3>
                <p className={styles.formSubtitle}>
                  Điền thông tin bên dưới — chúng tôi sẽ liên hệ ngay.
                </p>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.fieldGroup}>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Họ và tên<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className={styles.input}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Số điện thoại<span className={styles.required}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0868 699 860"
                        className={styles.input}
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Mục đích học tập</label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="">-- Chọn mục đích --</option>
                      {PURPOSES.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Cơ sở tập luyện</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="">-- Chọn cơ sở gần nhất --</option>
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.shortName} {b.isFree ? '(Miễn phí)' : `(${b.fee})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || isPending}
                    className={styles.submitBtn}
                  >
                    {isPending ? 'Đang gửi...' : (
                      <>
                        Đăng ký ngay — Miễn phí
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <p className={styles.formNote}>
                  🔒 Thông tin của bạn được bảo mật tuyệt đối
                </p>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
