"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/actions/auth.actions";
import {
  createTreatment,
  deleteTreatment,
  updateTreatment,
} from "@/lib/services/treatment";
import { CreateTreatmentDto, UpdateTreatmentDto } from "@/types/treatment";

export async function createTreatmentAction(data: CreateTreatmentDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const treatment = await createTreatment(data, token);
  revalidatePath("/tratamientos");
  return treatment;
}

export async function updateTreatmentAction(
  id: string,
  data: UpdateTreatmentDto,
) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const treatment = await updateTreatment(id, data, token);
  revalidatePath("/tratamientos");
  return treatment;
}

export async function deleteTreatmentAction(id: string) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  await deleteTreatment(id, token);
  revalidatePath("/tratamientos");
}
