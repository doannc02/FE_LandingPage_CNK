"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import { userApi, type UserProfile, type UpdateProfileRequest } from "@/app/lib/api/user";
import { User, Shield, Lock, Save, Loader2, Check, Camera } from "lucide-react";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 10,
  fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff",
};

const ROLE_LABELS: Record<string, string> = {
  SuperAdmin: "Quản trị viên cao cấp", SubAdmin: "Quản trị viên", Student: "Học viên", Guest: "Khách",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"info" | "security">("info");

  // Edit form
  const [form, setForm] = useState<UpdateProfileRequest>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMsg, setSaveMsg] = useState("");

  // Password change form
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { router.replace("/login"); return; }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    userApi.getMe()
      .then((data) => {
        setProfile(data);
        setForm({ fullName: data.fullName, phone: data.phone, address: data.address, dateOfBirth: data.dateOfBirth, gender: data.gender, avatarUrl: data.avatarUrl });
      })
      .catch(() => {
        // fallback to context data if /users/me is not accessible
        setProfile({ id: user.id, email: user.email, username: user.username, fullName: user.fullName, role: user.role, avatarUrl: user.avatarUrl });
        setForm({ fullName: user.fullName, avatarUrl: user.avatarUrl });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      const ok = await userApi.updateProfile(profile.id, form);
      if (ok) {
        setSaveStatus("success");
        setSaveMsg("Cập nhật thông tin thành công!");
        setProfile((p) => p ? { ...p, ...form } : p);
      } else {
        setSaveStatus("error");
        setSaveMsg("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch {
      setSaveStatus("error");
      setSaveMsg("Có lỗi xảy ra.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwStatus("error"); setPwMsg("Mật khẩu mới không khớp."); return; }
    if (pwForm.next.length < 6) { setPwStatus("error"); setPwMsg("Mật khẩu tối thiểu 6 ký tự."); return; }
    setPwStatus("loading");
    setPwMsg("");
    try {
      const res = await userApi.changePassword(pwForm.current, pwForm.next);
      if (res.isSuccess) {
        setPwStatus("success");
        setPwMsg("Đổi mật khẩu thành công!");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        setPwStatus("error");
        setPwMsg(res.error ?? "Đổi mật khẩu thất bại.");
      }
    } catch {
      setPwStatus("error");
      setPwMsg("Có lỗi xảy ra.");
    } finally {
      setTimeout(() => setPwStatus("idle"), 3000);
    }
  };

  if (authLoading || loading) {
    return (
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#dc2626" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main style={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)", padding: "2.5rem 1rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt={profile.fullName} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.2)" }} />
              : <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>{profile.fullName[0]}</div>
            }
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer" }}>
              <Camera size={12} color="#374151" />
            </div>
          </div>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem", marginBottom: 4 }}>{profile.fullName}</h1>
            <p style={{ color: "#9ca3af", fontSize: 14 }}>{profile.email}</p>
            <span style={{ display: "inline-block", background: "rgba(220,38,38,0.15)", color: "#ef4444", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600, marginTop: 6 }}>
              {ROLE_LABELS[profile.role] ?? profile.role}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 0 }}>
          {([["info", "Thông tin", User], ["security", "Bảo mật", Lock]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "1rem 1.5rem", fontSize: 14, fontWeight: tab === key ? 700 : 400, color: tab === key ? "#dc2626" : "#6b7280", background: "none", border: "none", borderBottom: tab === key ? "2px solid #dc2626" : "2px solid transparent", cursor: "pointer" }}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {tab === "info" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "1.5rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={16} color="#dc2626" />Thông tin cá nhân
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Họ và tên</label>
                <input style={inputStyle} value={form.fullName ?? ""} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Email</label>
                <input style={{ ...inputStyle, background: "#f9fafb", color: "#9ca3af" }} value={profile.email} disabled />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Số điện thoại</label>
                <input style={inputStyle} type="tel" value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="0912 345 678" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Ngày sinh</label>
                <input style={inputStyle} type="date" value={form.dateOfBirth ?? ""} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Giới tính</label>
                <select style={inputStyle} value={form.gender ?? ""} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                  <option value="">-- Chọn --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>URL ảnh đại diện</label>
                <input style={inputStyle} value={form.avatarUrl ?? ""} onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Địa chỉ</label>
                <input style={inputStyle} value={form.address ?? ""} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Số nhà, đường, quận, thành phố..." />
              </div>
            </div>
            {saveStatus !== "idle" && (
              <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: saveStatus === "success" ? "#dcfce7" : "#fee2e2", color: saveStatus === "success" ? "#16a34a" : "#dc2626", fontSize: 13 }}>
                {saveMsg}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
              <button onClick={handleSave} disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : saveStatus === "success" ? <Check size={15} /> : <Save size={15} />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        )}

        {tab === "security" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "1.5rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={16} color="#dc2626" />Đổi mật khẩu
            </h2>
            <form onSubmit={handleChangePassword}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 380 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Mật khẩu hiện tại</label>
                  <input style={inputStyle} type="password" value={pwForm.current} onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Mật khẩu mới</label>
                  <input style={inputStyle} type="password" value={pwForm.next} onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))} minLength={6} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Xác nhận mật khẩu mới</label>
                  <input style={inputStyle} type="password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} required />
                </div>
                {pwStatus !== "idle" && (
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: pwStatus === "success" ? "#dcfce7" : pwStatus === "error" ? "#fee2e2" : "#f3f4f6", color: pwStatus === "success" ? "#16a34a" : pwStatus === "error" ? "#dc2626" : "#374151", fontSize: 13 }}>
                    {pwMsg || "Đang xử lý..."}
                  </div>
                )}
                <button type="submit" disabled={pwStatus === "loading"}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: pwStatus === "loading" ? "not-allowed" : "pointer", opacity: pwStatus === "loading" ? 0.7 : 1, width: "fit-content" }}>
                  {pwStatus === "loading" ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Lock size={15} />}
                  {pwStatus === "loading" ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
            <div style={{ borderTop: "1px solid #f3f4f6", marginTop: "2rem", paddingTop: "1.5rem" }}>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Đăng nhập bằng Google? Mật khẩu được quản lý bởi Google.</p>
              <Link href="/login" style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>← Về trang đăng nhập</Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
