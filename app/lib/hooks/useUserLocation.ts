"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type LocationStatus =
  | "idle"        // IP fetch failed — no location at all
  | "ip-loading"  // Silently fetching IP-based location on mount
  | "ip-success"  // Got approximate location from IP (no GPS permission needed)
  | "loading"     // Waiting for browser GPS response
  | "success"     // Got precise GPS coordinates
  | "denied"      // GPS denied AND IP fallback unavailable
  | "timeout"     // GPS timed out AND IP fallback unavailable
  | "error";      // Other error AND IP fallback unavailable

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface UseUserLocationReturn {
  location: UserLocation | null;
  status: LocationStatus;
  error: string | null;
  /** Upgrade to GPS precision — called on user button click */
  requestLocation: () => void;
}

async function fetchIpLocation(): Promise<UserLocation> {
  // ipinfo.io: 50k req/month free, proper CORS on all responses including errors
  const res = await fetch("https://ipinfo.io/json");
  if (!res.ok) throw new Error(`IP API error: ${res.status}`);
  const data: { loc?: string } = await res.json();
  // loc format: "lat,lng" e.g. "21.0245,105.8412"
  if (!data.loc) throw new Error("No location in response");
  const [lat, lng] = data.loc.split(",").map(Number);
  if (!isFinite(lat) || !isFinite(lng)) throw new Error("Invalid coordinates");
  return { lat, lng };
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("ip-loading");
  const [error, setError] = useState<string | null>(null);

  // Ref lets the GPS callback read current location without closure staleness
  const locationRef = useRef<UserLocation | null>(null);
  locationRef.current = location;

  // Auto-fetch IP-based location on mount — no user permission required
  useEffect(() => {
    let cancelled = false;
    fetchIpLocation()
      .then((loc) => {
        if (cancelled) return;
        setLocation(loc);
        setStatus("ip-success");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("idle");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      if (!locationRef.current) {
        setStatus("error");
        setError("Trình duyệt không hỗ trợ định vị GPS");
      }
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
        // If IP location is available, fall back gracefully instead of showing an error
        const hasIpLocation = Boolean(locationRef.current);

        if (err.code === 1) {
          setStatus(hasIpLocation ? "ip-success" : "denied");
          if (!hasIpLocation) setError("Bạn đã từ chối truy cập vị trí GPS");
        } else if (err.code === 3) {
          setStatus(hasIpLocation ? "ip-success" : "timeout");
          if (!hasIpLocation) setError("Hết thời gian chờ, vui lòng thử lại");
        } else {
          setStatus(hasIpLocation ? "ip-success" : "error");
          if (!hasIpLocation) setError("Không thể xác định vị trí của bạn");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  return { location, status, error, requestLocation };
}
