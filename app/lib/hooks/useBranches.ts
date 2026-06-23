'use client';

import { useQuery } from '@tanstack/react-query';
import type { BranchListItem } from '@/types/branch';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.dangcapnc.io.vn/api').replace(/\/$/, '');

// API returns: { isSuccess: true, data: { items: BranchListItem[], pageNumber, totalCount, ... } }
async function fetchBranches(): Promise<BranchListItem[]> {
  const res = await fetch(`${BASE}/branches?isActive=true&pageSize=100`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`fetchBranches: ${res.status}`);
  const json = await res.json() as unknown;

  // Unwrap ApiResponse envelope
  const envelope = json as Record<string, unknown>;
  const payload = 'isSuccess' in envelope ? envelope.data : json;

  // Unwrap paginated wrapper { items: [...] }
  if (payload && typeof payload === 'object' && 'items' in (payload as object)) {
    return ((payload as { items: BranchListItem[] }).items) ?? [];
  }

  // Fallback: plain array
  if (Array.isArray(payload)) return payload as BranchListItem[];

  return [];
}

export function useBranches() {
  return useQuery<BranchListItem[]>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
