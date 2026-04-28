"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/actions/auth.actions";
import {
  createCashEntry,
  deleteCashEntry,
  updateCashEntry,
} from "@/lib/services/cash";
import { CreateCashEntryDto, UpdateCashEntryDto } from "@/types/cash";

export async function createCashEntryAction(data: CreateCashEntryDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  const entry = await createCashEntry(data, token);
  revalidatePath("/caja");
  return entry;
}

export async function updateCashEntryAction(id: string, data: UpdateCashEntryDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  const entry = await updateCashEntry(id, data, token);
  revalidatePath("/caja");
  return entry;
}

export async function deleteCashEntryAction(id: string) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  await deleteCashEntry(id, token);
  revalidatePath("/caja");
}
