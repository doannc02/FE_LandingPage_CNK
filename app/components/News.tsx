"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePosts } from "../lib/hooks/usePosts";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function NewsSimple() {
  const [currentPage] = useState(1);
  const pageSize = 8;
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const { data: postsData, isLoading, error } = usePosts({
    pageNumber: currentPage,
    pageSize,
    status: "Published",
  });

  // Intersection Observer for scroll animations (one-time only)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Unobserve after first trigger
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: "-80px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  if (isLoading) {
    return (
      <section style={{ padding: '5rem 2rem', background: '#0A0A0A', minHeight: '400px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Đang tải...</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: '#1A1A1A', padding: '2rem', borderRadius: '8px' }}>
                Loading...
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ padding: '5rem 2rem', background: '#0A0A0A', minHeight: '400px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#ef4444' }}>Lỗi: {error.message}</h2>
        </div>
      </section>
    );
  }

  const posts = postsData?.items || [];
  const totalCount = postsData?.totalCount || 0;
 
  console.log('Rendered NewsSimple with posts:', posts, postsData);
  if (posts.length === 0) {
    return (
      <section style={{ padding: '5rem 2rem', background: '#0A0A0A', minHeight: '400px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem' }}>Không có bài viết</h2>
        </div>
      </section>
    );
  }

  const featuredPost = posts.find(p => p.isFeatured);
  const regularPosts = featuredPost ? posts.filter(p => p.id !== featuredPost.id) : posts;

  return (
    <section 
      ref={sectionRef}
      id="news"
      style={{ 
        padding: '5rem 2rem', 
        background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
        minHeight: '600px'
      }}
    >
      <style>{`
        .animate-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-item:nth-child(1) { transition-delay: 0s; }
        .animate-item:nth-child(2) { transition-delay: 0.1s; }
        .animate-item:nth-child(3) { transition-delay: 0.2s; }
        .animate-item:nth-child(4) { transition-delay: 0.3s; }
        .animate-item:nth-child(5) { transition-delay: 0.4s; }
        .animate-item:nth-child(6) { transition-delay: 0.5s; }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .hover-lift:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }

        .featured-hover {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .featured-hover:hover {
          transform: translateY(-5px);
        }

        .featured-hover img {
          transition: transform 0.6s ease;
        }

        .featured-hover:hover img {
          transform: scale(1.05);
        }

        .link-hover {
          transition: gap 0.2s ease, color 0.2s ease;
        }

        .link-hover:hover {
          gap: 0.75rem !important;
          color: #2563eb !important;
        }

        .button-hover {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        .badge-pulse {
          animation: badge-pulse 2s infinite;
        }

        @keyframes badge-pulse {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
          }
          50% { 
            box-shadow: 0 4px 30px rgba(245, 158, 11, 0.5);
          }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div 
          className={`animate-item ${hasAnimated ? 'visible' : ''}`}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#fff', 
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Tin Tức & <span style={{ 
              color: '#3b82f6',
              position: 'relative'
            }}>Sự Kiện</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8' }}>
            Cập nhật {totalCount} bài viết về hoạt động của câu lạc bộ
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div 
            className={`animate-item featured-hover ${hasAnimated ? 'visible' : ''}`}
            style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? '1.2fr 1fr' : '1fr',
              gap: '3rem',
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '4rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              position: 'relative', 
              minHeight: '400px',
              background: '#f0f0f0',
              overflow: 'hidden'
            }}>
              <img
                src={featuredPost.featuredImageUrl || '/images/banner.png'}
                alt={featuredPost.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/images/banner.png';
                }}
              />
              <div 
                className="badge-pulse"
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)'
                }}
              >
                ⭐ Nổi bật
              </div>
            </div>

            <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                  color: '#3b82f6',
                  padding: '0.4rem 1rem',
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid rgba(59,130,246,0.2)'
                }}>
                  {featuredPost.categoryName || 'Tin tức'}
                </span>
                <span style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#64748b', 
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  📅 {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                </span>
              </div>

              <h3 style={{ 
                fontSize: '1.875rem', 
                lineHeight: 1.3, 
                marginBottom: '1rem',
                color: '#1e293b'
              }}>
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  style={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}
                >
                  {featuredPost.title}
                </Link>
              </h3>

              <p style={{ 
                color: '#64748b', 
                lineHeight: 1.6, 
                marginBottom: '2rem',
                fontSize: '1.0625rem'
              }}>
                {featuredPost.excerpt || 'Không có mô tả'}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '1.25rem',
                color: '#64748b',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span>👁️</span>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{featuredPost.viewCount || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span>❤️</span>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{featuredPost.likeCount || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span>💬</span>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{featuredPost.commentCount || 0}</span>
                </div>
              </div>

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="button-hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  maxWidth: 'fit-content',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.2)'
                }}
              >
                <span>Đọc bài viết</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {regularPosts.map((post, index) => (
            <article
              key={post.id}
              className={`animate-item hover-lift ${hasAnimated ? 'visible' : ''}`}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 6px 25px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transitionDelay: `${0.2 + index * 0.1}s`
              }}
            >
              <div style={{ 
                position: 'relative', 
                height: '220px',
                background: '#f0f0f0',
                overflow: 'hidden'
              }}>
                <img
                  src={post.featuredImageUrl || '/images/logo.png'}
                  alt={post.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s ease'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.png';
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(59,130,246,0.95)',
                  color: 'white',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)'
                }}>
                  {post.categoryName || 'Tin tức'}
                </span>
              </div>

              <div style={{ padding: '1.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ 
                  fontSize: '0.8125rem', 
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.75rem'
                }}>
                  📅 {formatDate(post.publishedAt || post.createdAt)}
                </span>

                <h3 style={{ 
                  fontSize: '1.25rem', 
                  lineHeight: 1.4, 
                  marginBottom: '1rem',
                  color: '#1e293b',
                  flexGrow: 1
                }}>
                  <Link
                    href={`/posts/${post.slug}`}
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}
                  >
                    {post.title}
                  </Link>
                </h3>

                <p style={{
                  color: '#64748b',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  fontSize: '0.9375rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.excerpt || 'Không có mô tả'}
                </p>

                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1.25rem',
                    fontSize: '0.8125rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span>👁️</span>
                      <span style={{ fontWeight: 600, color: '#475569' }}>{post.viewCount || 0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span>❤️</span>
                      <span style={{ fontWeight: 600, color: '#475569' }}>{post.likeCount || 0}</span>
                    </div>
                  </div>

                  <Link
                    href={`/posts/${post.slug}`}
                    className="link-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    <span>Chi tiết</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div 
          className={`animate-item ${hasAnimated ? 'visible' : ''}`}
          style={{ 
            textAlign: 'center', 
            paddingTop: '3rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            transitionDelay: '0.6s'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '0 1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '0.9375rem', color: '#94a3b8', margin: 0 }}>
              Hiển thị <strong style={{ color: '#fff' }}>{posts.length}</strong> trên tổng số{" "}
              <strong style={{ color: '#fff' }}>{totalCount}</strong> bài viết
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#94a3b8', margin: 0 }}>
              Trang {currentPage} / {Math.ceil(totalCount / pageSize)}
            </p>
          </div>

          <Link
            href="/posts"
            className="button-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'transparent',
              color: '#3b82f6',
              padding: '1rem 2.5rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.0625rem',
              border: '2px solid #3b82f6'
            }}
          >
            <span>Khám phá tất cả bài viết</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}