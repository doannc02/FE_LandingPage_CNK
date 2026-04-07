import { NextRequest, NextResponse } from "next/server";
import { apiClient, type ApiResponse } from "@/app/lib/api/client";
import type { AuthResponse } from "@/app/lib/api/auth";

/**
 * Proxy POST /api/auth/exchange-token → backend
 * Bypasses browser CORS restriction when calling from localhost in dev.
 * Backend trả về Result<AuthResponse> = { isSuccess, data, error } — pass-through trực tiếp.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/exchange-token", body);

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data: unknown; status: number } };
    if (axiosErr.response) {
      // Backend trả về { isSuccess: false, error: "..." } — pass-through
      return NextResponse.json(axiosErr.response.data, { status: axiosErr.response.status });
    }

    return NextResponse.json(
      { isSuccess: false, data: null, error: "Proxy lỗi: không kết nối được backend" },
      { status: 502 }
    );
  }
}
