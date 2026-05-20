// lib/hooks/useContact.ts
import { useMutation } from "@tanstack/react-query";
import { contactApi } from "../api/contact";

interface ContactData {
  fullName: string;
  age: string;
  phone: string;
  email: string;
  purpose: string;
  trainingType: string;
  location: string;
  message: string;
}

async function submitContact(data: ContactData) {
  const messageParts = [
    data.message,
    data.purpose ? `Mục đích: ${data.purpose}` : "",
    data.trainingType
      ? `Hình thức: ${data.trainingType === "online" ? "Online" : "Trực tiếp"}`
      : "",
    data.age ? `Tuổi: ${data.age}` : "",
    data.location ? `Cơ sở: ${data.location}` : "",
  ].filter(Boolean);

  return contactApi.submitContact({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    message: messageParts.join("\n"),
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      console.log("✅ Contact form submitted successfully");
    },
    onError: (error) => {
      console.error("❌ Contact form error:", error);
    },
  });
}
