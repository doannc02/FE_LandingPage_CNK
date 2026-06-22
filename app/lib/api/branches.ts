import type { BranchListItem, BranchDetail } from '@/types/branch';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.dangcapnc.io.vn/api').replace(/\/$/, '');

interface ApiResult<T> {
  isSuccess: boolean;
  data: T | null;
  error: string | null;
}

interface Paginated<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

function extractData<T>(json: unknown): T | null {
  if (!json || typeof json !== 'object') return null;
  // Backend wraps in { isSuccess, data } envelope
  if ('isSuccess' in (json as object)) {
    const envelope = json as ApiResult<T>;
    return envelope.isSuccess ? envelope.data : null;
  }
  return json as T;
}

export async function getBranches(): Promise<BranchListItem[]> {
  const res = await fetch(`${BASE}/branches?isActive=true&pageSize=100`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`getBranches: ${res.status}`);
  const json = await res.json();
  const paginated = extractData<Paginated<BranchListItem>>(json);
  return paginated?.items ?? [];
}

export async function getBranchById(id: string): Promise<BranchDetail | null> {
  const res = await fetch(`${BASE}/branches/${id}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getBranchById: ${res.status}`);
  const json = await res.json();
  return extractData<BranchDetail>(json);
}
