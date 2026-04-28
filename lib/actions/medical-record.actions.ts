"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/actions/auth.actions";
import {
  createMedicalRecord,
  deleteMedicalRecord,
  updateMedicalRecord,
} from "@/lib/services/medical-record";
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from "@/types/medical-record";

export async function createMedicalRecordAction(data: CreateMedicalRecordDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  const record = await createMedicalRecord(data, token);
  revalidatePath("/historia-clinica");
  return record;
}

export async function updateMedicalRecordAction(id: string, data: UpdateMedicalRecordDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  const record = await updateMedicalRecord(id, data, token);
  revalidatePath("/historia-clinica");
  return record;
}

export async function deleteMedicalRecordAction(id: string) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  await deleteMedicalRecord(id, token);
  revalidatePath("/historia-clinica");
}
