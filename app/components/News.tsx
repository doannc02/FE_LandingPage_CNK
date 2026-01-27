"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePosts } from "../lib/hooks/usePosts";
import { ChevronLeft, ChevronRight, Calendar, Eye, Heart, MessageCircle, ArrowRight } from "lucide-react";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function News() {
  const [currentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const pageSize = 10;

  const {
    data: postsData,
    isLoading,
    error,
  } = usePosts({
    pageNumber: currentPage,
    pageSize,
    status: "Published",
  });

  const posts = postsData?.items || [];
  const totalCount = postsData?.totalCount || 0;
  
  // Tách bài nổi bật nhất (1 bài) và các bài còn lại cho slider
  const featuredPost = posts.find((p) => p.isFeatured);
  const sliderPosts = featuredPost 
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts.slice(1);

  // Số slides = tổng số bài / 3 (làm tròn lên)
  const totalSlides = Math.ceil(sliderPosts.length / 3);

  // Auto-play slider
  useEffect(() => {
    if (totalSlides === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Lấy 3 bài cho slide hiện tại
  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * 3;
    return sliderPosts.slice(startIndex, startIndex + 3);
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <section
        id="news"
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #fff8f0 0%, #ffe4cc 100%)",
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
              color: "#1a1a2e",
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
                  boxShadow: "0 4px 12px rgba(248,118,20,0.1)",
                }}
              >
                <div
                  style={{
                    height: "200px",
                    background:
                      "linear-gradient(90deg, #ffe4cc 25%, #ffd4b3 50%, #ffe4cc 75%)",
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
                      "linear-gradient(90deg, #ffe4cc 25%, #ffd4b3 50%, #ffe4cc 75%)",
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
                      "linear-gradient(90deg, #ffe4cc 25%, #ffd4b3 50%, #ffe4cc 75%)",
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
          background: "linear-gradient(180deg, #fff8f0 0%, #ffe4cc 100%)",
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
            boxShadow: "0 10px 40px rgba(248,118,20,0.15)",
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
              background: "linear-gradient(135deg, #f87614, #ff9f4a)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(248, 118, 20, 0.3)",
            }}
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  if (posts.length === 0) {
    return (
      <section
        id="news"
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #fff8f0 0%, #ffe4cc 100%)",
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
            boxShadow: "0 10px 40px rgba(248,118,20,0.15)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📰</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1a1a2e",
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

  const currentSlideItems = getCurrentSlideItems();

  // ============================================
  // MAIN CONTENT - ALWAYS VISIBLE
  // ============================================
  return (
    <motion.section
      id="news"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        padding: "5rem 2rem 3rem",
        background: "linear-gradient(135deg, #ffffff 0%, #fff8f0 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(248, 118, 20, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 159, 74, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ====== HEADER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(2rem, 5vw, 2.5rem)",
              fontWeight: 900,
              color: "#1a1a2e",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
              fontFamily: "'Crimson Pro', serif",
            }}
          >
            Tin Tức &{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f87614 0%, #ff9f4a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sự Kiện
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "1rem",
              color: "#64748b",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cập nhật {totalCount} bài viết về hoạt động của câu lạc bộ
          </motion.p>
        </motion.div>

        {/* ====== BÀI NỔI BẬT CHÍNH (1 BÀI) ====== */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 0,
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: "2.5rem",
              boxShadow: "0 10px 40px rgba(248,118,20,0.15)",
              cursor: "pointer",
              border: "1px solid rgba(248, 118, 20, 0.1)",
            }}
          >
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                position: "relative",
                minHeight: "380px",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "linear-gradient(135deg, #f87614, #ff6b00)",
                  color: "white",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 20px rgba(248, 118, 20, 0.3)",
                  animation: "badgePulse 2s infinite",
                }}
              >
                <span style={{ fontSize: "1rem" }}>⭐</span>
                <span>Nổi bật</span>
              </span>
            </motion.div>

            {/* Featured Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                padding: "2rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(248, 118, 20, 0.1), rgba(255, 159, 74, 0.1))",
                    color: "#f87614",
                    padding: "0.4rem 1rem",
                    borderRadius: "50px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    border: "1px solid rgba(248, 118, 20, 0.2)",
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
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  <Calendar size={14} strokeWidth={2} />
                  {formatDate(
                    featuredPost.publishedAt || featuredPost.createdAt
                  )}
                </span>
              </div>

              <h3
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                  lineHeight: 1.3,
                  marginBottom: "0.75rem",
                  fontFamily: "'Crimson Pro', serif",
                  fontWeight: 700,
                }}
              >
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  style={{
                    color: "#1a1a2e",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#f87614")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1a1a2e")
                  }
                >
                  {featuredPost.title}
                </Link>
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                  fontSize: "0.9375rem",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {featuredPost.excerpt}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginBottom: "1.25rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(248, 118, 20, 0.1)",
                  fontSize: "0.8125rem",
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
                  <Eye size={16} strokeWidth={2} />
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
                  <Heart size={16} strokeWidth={2} />
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
                  <MessageCircle size={16} strokeWidth={2} />
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
                  background: "linear-gradient(135deg, #f87614, #ff6b00)",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                  fontWeight: 600,
                  maxWidth: "fit-content",
                  boxShadow: "0 4px 20px rgba(248, 118, 20, 0.2)",
                  transition: "all 0.3s ease",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9375rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 30px rgba(248, 118, 20, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(248, 118, 20, 0.2)";
                }}
              >
                <span>Đọc bài viết</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* ====== SLIDER 3 BÀI TRÊN 1 DÒNG (DƯỚI) ====== */}
        {sliderPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{
              position: "relative",
              margin: "0 auto",
            }}
          >
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: "-3.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(248, 118, 20, 0.2)",
                color: "#f87614",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #f87614 0%, #ff9f4a 100%)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                e.currentTarget.style.boxShadow = "0 6px 25px rgba(248, 118, 20, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.color = "#f87614";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
              }}
              aria-label="Bài trước"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            <button
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: "-3.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(248, 118, 20, 0.2)",
                color: "#f87614",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #f87614 0%, #ff9f4a 100%)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                e.currentTarget.style.boxShadow = "0 6px 25px rgba(248, 118, 20, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.color = "#f87614";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
              }}
              aria-label="Bài sau"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>

            {/* Slider Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "400px",
                overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.5rem",
                  }}
                >
                  {currentSlideItems.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 6px 25px rgba(248,118,20,0.08)",
                        border: "1px solid rgba(248, 118, 20, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "box-shadow 0.3s ease",
                        height: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(248,118,20,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 25px rgba(248,118,20,0.08)";
                      }}
                    >
                      {/* Image */}
                      <div
                        style={{
                          position: "relative",
                          height: "160px",
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
                            top: "0.75rem",
                            left: "0.75rem",
                            background: "rgba(248,118,20,0.95)",
                            color: "white",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "6px",
                            fontSize: "0.6875rem",
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
                          padding: "1.25rem",
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            marginBottom: "0.625rem",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <Calendar size={12} strokeWidth={2} />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>

                        <h3
                          style={{
                            fontSize: "1rem",
                            lineHeight: 1.4,
                            marginBottom: "0.5rem",
                            color: "#1a1a2e",
                            flexGrow: 1,
                            fontFamily: "'Crimson Pro', serif",
                            fontWeight: 700,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
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
                              (e.currentTarget.style.color = "#f87614")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#1a1a2e")
                            }
                          >
                            {post.title}
                          </Link>
                        </h3>

                        <p
                          style={{
                            color: "#64748b",
                            lineHeight: 1.5,
                            marginBottom: "0.875rem",
                            fontSize: "0.8125rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontFamily: "'DM Sans', sans-serif",
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
                            paddingTop: "0.75rem",
                            borderTop: "1px solid rgba(248, 118, 20, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "0.875rem",
                              fontSize: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <Eye size={14} strokeWidth={2} />
                              <span style={{ fontWeight: 600, color: "#475569" }}>
                                {post.viewCount || 0}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <Heart size={14} strokeWidth={2} />
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
                              gap: "0.375rem",
                              color: "#f87614",
                              textDecoration: "none",
                              fontWeight: 600,
                              fontSize: "0.8125rem",
                              transition: "gap 0.2s ease",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.gap = "0.625rem";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.gap = "0.375rem";
                            }}
                          >
                            <span>Chi tiết</span>
                            <ArrowRight size={14} strokeWidth={2.5} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
              }}
            >
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: index === currentSlide ? "24px" : "8px",
                    height: "8px",
                    borderRadius: index === currentSlide ? "4px" : "50%",
                    background:
                      index === currentSlide
                        ? "linear-gradient(135deg, #f87614, #ff9f4a)"
                        : "rgba(248, 118, 20, 0.2)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentSlide) {
                      e.currentTarget.style.background = "rgba(248, 118, 20, 0.5)";
                      e.currentTarget.style.transform = "scale(1.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentSlide) {
                      e.currentTarget.style.background = "rgba(248, 118, 20, 0.2)";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                  aria-label={`Chuyển đến slide ${index + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ====== FOOTER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            textAlign: "center",
            paddingTop: "2.5rem",
            marginTop: "2rem",
            borderTop: "1px solid rgba(248, 118, 20, 0.1)",
          }}
        >
          <Link
            href="/posts"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "transparent",
              color: "#f87614",
              padding: "0.875rem 2rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9375rem",
              border: "2px solid #f87614",
              transition: "all 0.3s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #f87614, #ff9f4a)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(248, 118, 20, 0.3)";
              e.currentTarget.style.gap = "1rem";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#f87614";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.gap = "0.75rem";
            }}
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(248, 118, 20, 0.3); }
          50% { box-shadow: 0 4px 30px rgba(248, 118, 20, 0.5); }
        }

        @media (max-width: 1024px) {
          [style*="grid-template-columns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          [style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          [style*="left: -3.5rem"] {
            left: 0 !important;
          }
          [style*="right: -3.5rem"] {
            right: 0 !important;
          }
          [style*="grid-template-columns: repeat(3, 1fr)"],
          [style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          [style*="height: 400px"] {
            height: auto !important;
            min-height: 450px !important;
          }
        }
      `}</style>
    </motion.section>
  );
}