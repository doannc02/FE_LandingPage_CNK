'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cnk-announcement-dismissed-v1';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const updateVar = () => {
      const h = visible && barRef.current ? barRef.current.offsetHeight : 0;
      document.documentElement.style.setProperty('--announcement-bar-height', `${h}px`);
    };
    updateVar();
    window.addEventListener('resize', updateVar);
    return () => {
      window.removeEventListener('resize', updateVar);
      document.documentElement.style.setProperty('--announcement-bar-height', '0px');
    };
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        background: 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 50%, #b91c1c 100%)',
        color: '#fff',
        textAlign: 'center',
        padding: '0.625rem 3rem',
        fontSize: '0.8125rem',
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '0.01em',
      }}
    >
      <span style={{ marginRight: '0.5rem' }}>🎉</span>
      <strong>Khai giảng tháng 7/2026</strong>
      {' '}— Chỉ còn 10 chỗ trống.{' '}
      <a
        href="#dang-ky"
        onClick={dismiss}
        style={{
          color: '#ffd4b3',
          fontWeight: 700,
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
        }}
      >
        Đăng ký ngay để nhận ưu đãi 20% học phí →
      </a>

      <button
        onClick={dismiss}
        aria-label="Đóng thông báo"
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          lineHeight: 1,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
