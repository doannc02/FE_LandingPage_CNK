'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#0a0a0a',
      color: '#fff',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
        Đã xảy ra lỗi
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: 400 }}>
        Trang này gặp sự cố. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9375rem',
          }}
        >
          Thử lại
        </button>
        <Link
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.9375rem',
          }}
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
