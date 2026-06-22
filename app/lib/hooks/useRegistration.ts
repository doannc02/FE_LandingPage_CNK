import { useMutation } from "@tanstack/react-query";
import { contactApi } from "../api/contact";

interface RegistrationData {
  fullName: string;
  age: string;
  phone: string;
  purpose: string;
  trainingType: "online" | "offline" | "";
  location: string;
}

async function submitRegistration(data: RegistrationData) {
  const messageParts = [
    data.purpose ? `Mục đích: ${data.purpose}` : "",
    data.trainingType
      ? `Hình thức: ${data.trainingType === "online" ? "Online" : "Trực tiếp"}`
      : "",
    data.age ? `Tuổi: ${data.age}` : "",
    data.location ? `Cơ sở: ${data.location}` : "",
    "Nguồn: Popup đăng ký",
  ].filter(Boolean);

  return contactApi.submitContact({
    fullName: data.fullName,
    phone: data.phone,
    email: "",
    message: messageParts.join("\n"),
  });
}

export function useSubmitRegistration() {
  return useMutation({
    mutationFn: submitRegistration,
  });
}
