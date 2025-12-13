// app/posts/[slug]/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// ✅ Disable SSR - chỉ render client-side
const PostPageContent = dynamic(() => import('./PostPageContent'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem',
        }}></div>
        <p style={{ color: '#64748b' }}>Đang tải...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <PostPageContent slug={slug} />;
}