// lib/hooks/useRegistration.ts
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api/client";

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

  // Gọi Next.js API route nội bộ — dùng baseURL: '' để không prefix backend URL
  const response = await apiClient.post(
    "/api/submit-registration",
    payload,
    { baseURL: "" }
  );

  return response.data;
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
