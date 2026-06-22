"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/app/lib/api/course";
import { Check, Clock, Users, ChevronRight, Loader2 } from "lucide-react";

const LEVEL_LABEL: Record<string, string> = {
  Beginner: "Cơ bản", Intermediate: "Trung cấp", Advanced: "Nâng cao", Professional: "Chuyên nghiệp",
};

function EnrollForm({ courseId, courseName }: { courseId: string; courseName: string }) {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim()) { setErrMsg("Vui lòng điền họ tên và số điện thoại"); return; }
    setStatus("loading");
    setErrMsg("");
    try {
      const result = await coursesApi.enrollCourse({
        fullName: form.fullName, phone: form.phone, email: form.email || undefined,
        courseId, message: form.message || undefined,
      });
      if (result.isSuccess) { setStatus("success"); }
      else { setStatus("error"); setErrMsg(result.error ?? "Đăng ký thất bại. Vui lòng thử lại."); }
    } catch {
      setStatus("error");
      setErrMsg("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <Check size={24} color="#16a34a" />
        </div>
        <h3 style={{ fontWeight: 700, color: "#111827", marginBottom: 8 }}>Đăng ký thành công!</h3>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#111827", marginBottom: "1rem" }}>
        Đăng ký học — {courseName}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Họ và tên *</label>
          <input style={inputStyle} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Nguyễn Văn A" required />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Số điện thoại *</label>
          <input style={inputStyle} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0912 345 678" required />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Email</label>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Ghi chú</label>
          <textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Kinh nghiệm võ thuật, thời gian mong muốn..." />
        </div>
        {errMsg && <p style={{ color: "#dc2626", fontSize: 13 }}>{errMsg}</p>}
        <button type="submit" disabled={status === "loading"}
          style={{ padding: "12px 24px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {status === "loading" ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Đang gửi...</> : "Đăng ký ngay"}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 10,
  fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111827",
};

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course-slug", slug],
    queryFn: () => coursesApi.getCourseBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#dc2626" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
        <h2 style={{ fontWeight: 700, color: "#111827", marginBottom: 8 }}>Không tìm thấy khóa học</h2>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>Khóa học này không tồn tại hoặc đã bị ẩn.</p>
        <Link href="/#courses" style={{ color: "#dc2626", fontWeight: 600 }}>← Xem tất cả khóa học</Link>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)", padding: "3rem 1rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", marginBottom: "1.25rem" }}>
            <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Trang chủ</Link>
            <ChevronRight size={13} />
            <Link href="/#courses" style={{ color: "#9ca3af", textDecoration: "none" }}>Khóa học</Link>
            <ChevronRight size={13} />
            <span style={{ color: "#ef4444" }}>{course.name}</span>
          </nav>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 340px" }}>
              <span style={{ display: "inline-block", background: "rgba(220,38,38,0.15)", color: "#ef4444", borderRadius: 999, padding: "3px 12px", fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
                {LEVEL_LABEL[course.level] ?? course.level}
              </span>
              <h1 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>{course.name}</h1>
              <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.7, marginBottom: "1.5rem" }}>{course.description}</p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#d1d5db" }}>
                  <Clock size={15} color="#ef4444" /><span style={{ fontSize: 14 }}>{course.durationMonths} tháng</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#d1d5db" }}>
                  <Users size={15} color="#ef4444" /><span style={{ fontSize: 14 }}>{course.sessionsPerWeek} buổi/tuần</span>
                </div>
              </div>
            </div>
            {course.thumbnailUrl && (
              <div style={{ flex: "0 0 auto", borderRadius: 16, overflow: "hidden", maxWidth: 320 }}>
                <img src={course.thumbnailUrl} alt={course.name} style={{ width: "100%", display: "block" }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem", display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
        {/* Left: features */}
        <div style={{ flex: "1 1 340px" }}>
          {course.features && course.features.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#111827", marginBottom: "1rem" }}>Quyền lợi khóa học</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {course.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check size={12} color="#16a34a" />
                    </div>
                    <span style={{ color: "#374151", fontSize: 14, lineHeight: 1.5 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Pricing */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "1.5rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#111827", marginBottom: "0.75rem" }}>Học phí</h2>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              {course.isFree
                ? <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>Miễn phí</span>
                : <><span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#dc2626" }}>{course.price.toLocaleString("vi-VN")}đ</span><span style={{ color: "#9ca3af", fontSize: 13 }}>/tháng</span></>
              }
            </div>
          </div>
        </div>

        {/* Right: enrollment form */}
        <div style={{ flex: "0 0 auto", width: "clamp(300px, 35%, 380px)", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "1.5rem", position: "sticky", top: 80 }}>
          <EnrollForm courseId={course.id} courseName={course.name} />
        </div>
      </div>
    </main>
  );
}
