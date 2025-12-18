"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePosts } from "../lib/hooks/usePosts";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function News() {
  const [currentPage] = useState(1);
  const pageSize = 8;

  const {
    data: postsData,
    isLoading,
    error,
  } = usePosts({
    pageNumber: currentPage,
    pageSize,
    status: "Published",
  });

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <section
        id="news"
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          minHeight: "600px",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "3rem",
            }}
          >
            Tin Tức & Sự Kiện
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    height: "200px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    animation: "shimmer 1.5s infinite",
                  }}
                ></div>
                <div
                  style={{
                    height: "24px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "4px",
                    marginBottom: "0.75rem",
                    animation: "shimmer 1.5s infinite",
                  }}
                ></div>
                <div
                  style={{
                    height: "16px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "4px",
                    width: "60%",
                    animation: "shimmer 1.5s infinite",
                  }}
                ></div>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      </section>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <section
        id="news"
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          minHeight: "600px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            padding: "3rem",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>⚠️</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#ef4444",
              marginBottom: "1rem",
            }}
          >
            Lỗi tải tin tức
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#64748b",
              marginBottom: "2rem",
            }}
          >
            {error.message || "Không thể tải danh sách bài viết"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.875rem 2rem",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
            }}
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  const posts = postsData?.items || [];
  const totalCount = postsData?.totalCount || 0;

  // ============================================
  // EMPTY STATE
  // ============================================
  if (posts.length === 0) {
    return (
      <section
        id="news"
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          minHeight: "600px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            padding: "3rem",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📰</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Chưa có bài viết
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#64748b" }}>
            Vui lòng quay lại sau để xem tin tức mới nhất
          </p>
        </div>
      </section>
    );
  }

  const featuredPost = posts.find((p) => p.isFeatured);
  const regularPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  // ============================================
  // MAIN CONTENT - ALWAYS VISIBLE
  // ============================================
  return (
    <section
      id="news"
      style={{
        padding: "5rem 2rem",
        background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "600px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* ====== HEADER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <motion.h2
            style={{
              fontSize: "clamp(2rem, 5vw, 2.5rem)",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Tin Tức &{" "}
            <span style={{ color: "#3b82f6", position: "relative" }}>
              Sự Kiện
            </span>
          </motion.h2>
          <p style={{ fontSize: "1.125rem", color: "#64748b" }}>
            Cập nhật {totalCount} bài viết về hoạt động của câu lạc bộ
          </p>
        </motion.div>

        {/* ====== FEATURED POST ====== */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "3rem",
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: "4rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
              cursor: "pointer",
              border: "1px solid #f1f5f9",
            }}
          >
            {/* Featured Image */}
            <div
              style={{
                position: "relative",
                minHeight: "400px",
                overflow: "hidden",
                background: "#f0f0f0",
              }}
            >
              <img
                src={featuredPost.featuredImageUrl || "/images/banner.png"}
                alt={featuredPost.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s ease",
                }}
                onError={(e) => {
                  e.currentTarget.src = "/images/banner.png";
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <span
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)",
                }}
              >
                ⭐ Nổi bật
              </span>
            </div>

            {/* Featured Content */}
            <div
              style={{
                padding: "clamp(2rem, 5vw, 3rem) clamp(1.5rem, 5vw, 2.5rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
                    color: "#3b82f6",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "50px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {featuredPost.categoryName || "Tin tức"}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#64748b",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  📅{" "}
                  {formatDate(
                    featuredPost.publishedAt || featuredPost.createdAt
                  )}
                </span>
              </div>

              <h3
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
                  lineHeight: 1.3,
                  marginBottom: "1rem",
                }}
              >
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  style={{
                    color: "#1e293b",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#3b82f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1e293b")
                  }
                >
                  {featuredPost.title}
                </Link>
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.6,
                  marginBottom: "2rem",
                  fontSize: "clamp(1rem, 2vw, 1.0625rem)",
                }}
              >
                {featuredPost.excerpt}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f1f5f9",
                  fontSize: "0.875rem",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>👁️</span>
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    {featuredPost.viewCount || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>❤️</span>
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    {featuredPost.likeCount || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>💬</span>
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    {featuredPost.commentCount || 0}
                  </span>
                </div>
              </div>

              <Link
                href={`/posts/${featuredPost.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  color: "white",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                  fontWeight: 600,
                  maxWidth: "fit-content",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 30px rgba(59, 130, 246, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(59, 130, 246, 0.2)";
                }}
              >
                <span>Đọc bài viết</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ====== REGULAR POSTS GRID ====== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8 }}
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 25px rgba(0,0,0,0.06)",
                border: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.06)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  height: "220px",
                  background: "#f0f0f0",
                  overflow: "hidden",
                }}
              >
                <img
                  src={post.featuredImageUrl || "/images/logo.png"}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/images/logo.png";
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <span
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    background: "rgba(59,130,246,0.95)",
                    color: "white",
                    padding: "0.4rem 0.9rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {post.categoryName || "Tin tức"}
                </span>
              </div>

              {/* Content */}
              <div
                style={{
                  padding: "1.75rem",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  📅 {formatDate(post.publishedAt || post.createdAt)}
                </span>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    lineHeight: 1.4,
                    marginBottom: "1rem",
                    color: "#1e293b",
                    flexGrow: 1,
                  }}
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#3b82f6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#1e293b")
                    }
                  >
                    {post.title}
                  </Link>
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem",
                    fontSize: "0.9375rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.excerpt || "Không có mô tả"}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}
                    >
                      <span>👁️</span>
                      <span style={{ fontWeight: 600, color: "#475569" }}>
                        {post.viewCount || 0}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}
                    >
                      <span>❤️</span>
                      <span style={{ fontWeight: 600, color: "#475569" }}>
                        {post.likeCount || 0}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/posts/${post.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#3b82f6",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      transition: "gap 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.gap = "0.75rem";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.gap = "0.5rem";
                    }}
                  >
                    <span>Chi tiết</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ====== FOOTER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            paddingTop: "3rem",
            borderTop: "1px solid #cbd5e1",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              padding: "0 1rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p style={{ fontSize: "0.9375rem", color: "#64748b", margin: 0 }}>
              Hiển thị{" "}
              <strong style={{ color: "#1e293b" }}>{posts.length}</strong> trên
              tổng số <strong style={{ color: "#1e293b" }}>{totalCount}</strong>{" "}
              bài viết
            </p>
            <p style={{ fontSize: "0.9375rem", color: "#64748b", margin: 0 }}>
              Trang {currentPage} / {Math.ceil(totalCount / pageSize)}
            </p>
          </div>

          <Link
            href="/posts"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "transparent",
              color: "#3b82f6",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.0625rem",
              border: "2px solid #3b82f6",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #3b82f6, #8b5cf6)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(59, 130, 246, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#3b82f6";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>Khám phá tất cả bài viết</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
