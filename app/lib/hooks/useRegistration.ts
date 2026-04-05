// lib/hooks/useRegistration.ts
import { useMutation } from "@tanstack/react-query";

interface RegistrationData {
  fullName: string;
  age: string;
  phone: string;
  purpose: string;
  trainingType: "online" | "offline" | "";
  location: string;
}

const locationNames: Record<string, string> = {
  "van-yen": "Cơ sở 1: Trường TH Văn Yên - Hà Đông (2-4-6)",
  "kien-hung": "Cơ sở 2: Vườn hoa Hàng Bè - Kiến Hưng (3-5-7)",
  "thong-nhat": "Cơ sở 3: Công viên Thống Nhất",
  "hoa-binh": "Cơ sở 4: Công viên Hòa Bình (3-5-7)",
  "kim-giang": "Cơ sở 5: Kim Giang - Thanh Xuân",
};

async function submitRegistration(data: RegistrationData) {
  const timestamp = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const payload = {
    timestamp,
    fullName: data.fullName,
    age: data.age,
    phone: data.phone,
    purpose: data.purpose,
    trainingType: data.trainingType === "online" ? "Online" : "Trực tiếp",
    location: locationNames[data.location] || data.location,
  };

  const response = await fetch("/api/submit-registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Gửi đăng ký thất bại");
  }

  return response.json();
}

export function useSubmitRegistration() {
  return useMutation({
    mutationFn: submitRegistration,
    onSuccess: () => {
      console.log("✅ Registration submitted successfully");
    },
    onError: (error) => {
      console.error("❌ Registration error:", error);
    },
  });
}
