"use client";

import { useMemo } from "react";
import { BRANCHES, type Branch } from "../data/branches";
import { getDistance } from "../utils/getDistance";
import type { UserLocation } from "./useUserLocation";

export interface NearestBranchResult {
  branch: Branch;
  /** Straight-line distance in kilometers (Haversine) */
  distance: number;
}

/**
 * Given a user location, returns the nearest branch sorted by distance.
 * Result is memoized — recalculates only when location changes.
 *
 * @param location - User's GPS coordinates, or null if unavailable
 * @returns Nearest branch with distance, or null if no location
 */
export function useNearestBranch(
  location: UserLocation | null
): NearestBranchResult | null {
  return useMemo(() => {
    if (!location) return null;

    const withDistances = BRANCHES.map((branch) => ({
      branch,
      distance: getDistance(
        location.lat,
        location.lng,
        branch.lat,
        branch.lng
      ),
    }));

    // Sort ascending by distance
    withDistances.sort((a, b) => a.distance - b.distance);

    return withDistances[0] ?? null;
  }, [location]);
}
