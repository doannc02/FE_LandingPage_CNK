import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api/client";
import type { AuthResponse } from "@/app/lib/api/auth";

/**
 * Proxy POST /api/auth/exchange-token → backend
 * Bypasses browser CORS restriction when calling from localhost in dev.
 * Normalizes the raw AuthResponse into { isSuccess, data } wrapper.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Backend returns AuthResponse directly (not wrapped in ApiResponse)
    const res = await apiClient.post<AuthResponse>("/auth/exchange-token", body);

    return NextResponse.json(
      { isSuccess: true, data: res.data },
      { status: res.status }
    );
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data: unknown; status: number } };
    if (axiosErr.response) {
      return NextResponse.json(
        { isSuccess: false, error: axiosErr.response.data },
        { status: axiosErr.response.status }
      );
    }

    return NextResponse.json(
      { isSuccess: false, data: null, error: "Proxy lỗi: không kết nối được backend" },
      { status: 502 }
    );
  }
}
