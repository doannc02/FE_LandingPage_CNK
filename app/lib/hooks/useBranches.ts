'use client';

import { useQuery } from '@tanstack/react-query';
import type { BranchListItem } from '@/types/branch';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.dangcapnc.io.vn/api').replace(/\/$/, '');

async function fetchBranches(): Promise<BranchListItem[]> {
  const res = await fetch(`${BASE}/branches?isActive=true`);
  if (!res.ok) throw new Error(`fetchBranches: ${res.status}`);
  const json = await res.json();
  if (json && typeof json === 'object' && 'isSuccess' in json) {
    return (json as { data?: BranchListItem[] }).data ?? [];
  }
  return json as BranchListItem[];
}

export function useBranches() {
  return useQuery<BranchListItem[]>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    staleTime: 1000 * 60 * 10,
  });
}
