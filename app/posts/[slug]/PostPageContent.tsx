// app/posts/[slug]/PostPageContent.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostBySlug, useRelatedPosts } from '@/app/lib/hooks/usePosts';
import PostDetail from '@/app/components/Postdetail';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  slug: string;
}

function PostContent({ slug }: Props) {
  const { data: post, isLoading, error } = usePostBySlug(slug);
  const { data: relatedPosts = [] } = useRelatedPosts(slug, 5);

  if (isLoading) {
    return (
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
          <p style={{ color: '#64748b' }}>Đang tải bài viết...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{
            fontSize: '8rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0',
          }}>
            404
          </h1>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#1e293b',
            margin: '1rem 0',
          }}>
            Không tìm thấy bài viết
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            marginBottom: '2rem',
          }}>
            Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            href="/posts"
            style={{
              display: 'inline-block',
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Về trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  return <PostDetail post={post as any} relatedPosts={relatedPosts as any[]} />;
}

export default function PostPageContent({ slug }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <PostContent slug={slug} />
    </QueryClientProvider>
  );
}