import { CashEntry, CashSummary, CreateCashEntryDto, UpdateCashEntryDto } from "@/types/cash";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error en la solicitud");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getCashEntries = (token: string, from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<CashEntry[]>(`/cash${qs}`, token);
};

export const getCashSummary = (token: string, from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<CashSummary>(`/cash/summary${qs}`, token);
};

export const getCashEntryById = (id: string, token: string) =>
  apiFetch<CashEntry>(`/cash/${id}`, token);

export const createCashEntry = (data: CreateCashEntryDto, token: string) =>
  apiFetch<CashEntry>("/cash", token, { method: "POST", body: JSON.stringify(data) });

export const updateCashEntry = (id: string, data: UpdateCashEntryDto, token: string) =>
  apiFetch<CashEntry>(`/cash/${id}`, token, { method: "PATCH", body: JSON.stringify(data) });

export const deleteCashEntry = (id: string, token: string) =>
  apiFetch<void>(`/cash/${id}`, token, { method: "DELETE" });
