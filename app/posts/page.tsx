"use client";

import { useState } from "react";
import Link from "next/link";
import { usePosts } from "@/app/lib/hooks/usePosts";
import { useCategories } from "@/app/lib/hooks/useCategories";
import { Calendar, Eye, Heart, MessageCircle, ChevronLeft, ChevronRight, Search, Tag } from "lucide-react";

const PAGE_SIZE = 9;

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN");
}

function PostCard({ post }: { post: { id: string; title: string; slug: string; thumbnailUrl?: string; featuredImageUrl?: string; excerpt?: string; categoryName?: string; publishedAt?: string; createdAt: string; viewCount: number; likeCount: number; commentCount: number } }) {
  const img = post.thumbnailUrl || post.featuredImageUrl;
  return (
    <Link href={`/posts/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {img
          ? <img src={img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Không có ảnh</div>
        }
      </div>
      <div className="p-4">
        {post.categoryName && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
            <Tag size={9} />{post.categoryName}
          </span>
        )}
        <h2 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
        {post.excerpt && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(post.publishedAt || post.createdAt)}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5"><Eye size={11} />{post.viewCount}</span>
            <span className="flex items-center gap-0.5"><Heart size={11} />{post.likeCount}</span>
            <span className="flex items-center gap-0.5"><MessageCircle size={11} />{post.commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: postsData, isLoading, isError } = usePosts({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    status: "Published",
    searchTerm: search || undefined,
    categoryId: categoryId || undefined,
  });

  const { data: categories } = useCategories();

  const posts = postsData?.items ?? [];
  const totalPages = postsData?.totalPages ?? 1;
  const totalCount = postsData?.totalCount ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  return (
    <main>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)", padding: "4rem 1rem 3rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(220,38,38,0.15)", color: "#ef4444", borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            TIN TỨC &amp; BÀI VIẾT
          </span>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
            Kiến Thức <span style={{ color: "#ef4444" }}>Võ Thuật</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1rem", maxWidth: 560, margin: "0 auto 1.5rem" }}>
            Cập nhật tin tức, kỹ thuật và kiến thức về Côn Nhị Khúc và võ cổ truyền Việt Nam.
          </p>
          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                placeholder="Tìm bài viết..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" style={{ padding: "10px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              Tìm
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "0.75rem 1rem", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 8, maxWidth: 1200, margin: "0 auto", flexWrap: "wrap" }}>
            <button onClick={() => handleCategory("")}
              style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid", borderColor: !categoryId ? "#dc2626" : "#d1d5db", background: !categoryId ? "#dc2626" : "#fff", color: !categoryId ? "#fff" : "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Tất cả
            </button>
            {categories.map((c: { id: string; name: string }) => (
              <button key={c.id} onClick={() => handleCategory(c.id)}
                style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid", borderColor: categoryId === c.id ? "#dc2626" : "#d1d5db", background: categoryId === c.id ? "#dc2626" : "#fff", color: categoryId === c.id ? "#fff" : "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
        {search && (
          <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: 14 }}>
            Kết quả tìm kiếm cho &ldquo;<strong>{search}</strong>&rdquo; — {totalCount} bài viết
          </p>
        )}
        {isError ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#9ca3af" }}>
            <p style={{ fontSize: 16, color: "#ef4444" }}>Không thể tải bài viết. Vui lòng thử lại sau.</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, color: "#dc2626", background: "none", border: "1px solid #dc2626", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14 }}>Thử lại</button>
          </div>
        ) : isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                <div style={{ aspectRatio: "16/9", background: "#f3f4f6" }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 14, background: "#f3f4f6", borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 18, background: "#f3f4f6", borderRadius: 6, marginBottom: 6 }} />
                  <div style={{ height: 14, background: "#f3f4f6", borderRadius: 6, width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#9ca3af" }}>
            <p style={{ fontSize: 16 }}>Không có bài viết nào.</p>
            {search && <button onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} style={{ marginTop: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>Xóa tìm kiếm</button>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: "2rem" }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              style={{ padding: "8px 14px", border: "1px solid #d1d5db", borderRadius: 10, background: page <= 1 ? "#f9fafb" : "#fff", cursor: page <= 1 ? "not-allowed" : "pointer", opacity: page <= 1 ? 0.5 : 1, display: "flex", alignItems: "center" }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 14, color: "#374151" }}>Trang {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              style={{ padding: "8px 14px", border: "1px solid #d1d5db", borderRadius: 10, background: page >= totalPages ? "#f9fafb" : "#fff", cursor: page >= totalPages ? "not-allowed" : "pointer", opacity: page >= totalPages ? 0.5 : 1, display: "flex", alignItems: "center" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
