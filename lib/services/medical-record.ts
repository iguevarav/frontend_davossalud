import {
  MedicalRecord,
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from "@/types/medical-record";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
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

export const getMedicalRecordsList = (token: string) =>
  apiFetch<MedicalRecord[]>("/medical-records", token);

export const getMedicalRecordsByPatient = (patientId: string, token: string) =>
  apiFetch<MedicalRecord[]>(`/medical-records/patient/${patientId}`, token);

export const getMedicalRecordById = (id: string, token: string) =>
  apiFetch<MedicalRecord>(`/medical-records/${id}`, token);

export const createMedicalRecord = (data: CreateMedicalRecordDto, token: string) =>
  apiFetch<MedicalRecord>("/medical-records", token, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateMedicalRecord = (id: string, data: UpdateMedicalRecordDto, token: string) =>
  apiFetch<MedicalRecord>(`/medical-records/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteMedicalRecord = (id: string, token: string) =>
  apiFetch<void>(`/medical-records/${id}`, token, { method: "DELETE" });
