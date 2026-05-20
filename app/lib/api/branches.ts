import type { BranchListItem, BranchDetail } from '@/types/branch';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.dangcapnc.io.vn/api').replace(/\/$/, '');

/** Unwrap ApiResponse<T> wrapper nếu có, fallback về raw json */
function unwrap<T>(json: unknown): T {
  if (json && typeof json === 'object' && 'isSuccess' in (json as object)) {
    return ((json as { data?: T }).data ?? []) as T;
  }
  return json as T;
}

export async function getBranches(): Promise<BranchListItem[]> {
  const res = await fetch(`${BASE}/branches?isActive=true`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`getBranches: ${res.status}`);
  return unwrap<BranchListItem[]>(await res.json());
}

export async function getBranchById(id: string): Promise<BranchDetail | null> {
  const res = await fetch(`${BASE}/branches/${id}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getBranchById: ${res.status}`);
  return unwrap<BranchDetail>(await res.json());
}
