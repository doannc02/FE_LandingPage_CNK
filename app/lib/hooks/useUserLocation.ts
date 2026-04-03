"use client";

import { useState, useCallback } from "react";

export type LocationStatus =
  | "idle"       // Not yet requested
  | "loading"    // Waiting for browser response
  | "success"    // Got coordinates
  | "denied"     // User denied permission
  | "timeout"    // Request timed out
  | "error";     // Other error (no geolocation support, etc.)

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface UseUserLocationReturn {
  location: UserLocation | null;
  status: LocationStatus;
  error: string | null;
  /** Call this on user interaction (button click) — never call automatically on mount */
  requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    // Geolocation not available (e.g., server-side, old browser)
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Trình duyệt không hỗ trợ định vị GPS");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("success");
      },
      (err) => {
        // err.code: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        if (err.code === 1) {
          setStatus("denied");
          setError("Bạn đã từ chối truy cập vị trí");
        } else if (err.code === 3) {
          setStatus("timeout");
          setError("Hết thời gian chờ, vui lòng thử lại");
        } else {
          setStatus("error");
          setError("Không thể xác định vị trí của bạn");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,         // 10 seconds
        maximumAge: 300000,     // Cache position for 5 minutes
      }
    );
  }, []);

  return { location, status, error, requestLocation };
}
