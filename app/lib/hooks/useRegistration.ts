// lib/hooks/useRegistration.ts
import { useMutation } from "@tanstack/react-query";

interface RegistrationData {
  fullName: string;
  age: string;
  purpose: string;
  trainingType: "online" | "offline" | "";
  location: string;
}

// Google Sheets Web App URL - Replace with your actual URL
const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || "";

async function submitRegistration(data: RegistrationData) {
  const timestamp = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const locationNames: Record<string, string> = {
    "van-yen": "Cơ sở 1: Trường TH Văn Yên - Hà Đông (2-4-6)",
    "kien-hung": "Cơ sở 2: Vườn hoa Hàng Bè - Kiến Hưng (3-5-7)",
    "thong-nhat": "Cơ sở 3: Công viên Thống Nhất",
    "hoa-binh": "Cơ sở 4: Công viên Hòa Bình (3-5-7)",
    "kim-giang": "Cơ sở 5: Kim Giang - Thanh Xuân",
  };

  const payload = {
    timestamp,
    fullName: data.fullName,
    age: data.age,
    purpose: data.purpose,
    trainingType: data.trainingType === "online" ? "Online" : "Trực tiếp",
    location: locationNames[data.location] || data.location,
  };

  // Send to Google Sheets
  if (GOOGLE_SHEETS_URL) {
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors", // Important for Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Note: no-cors mode won't return response data
    // Consider the request successful if no error is thrown
    return { success: true };
  } else {
    // Fallback: Log to console or send to your own API
    console.log("📝 Registration Data:", payload);

    // Optional: Send to your own backend API
    // const response = await fetch('/api/registrations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // return response.json();

    return { success: true };
  }
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
