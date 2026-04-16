"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/actions/auth.actions";
import {
  createAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentsList,
} from "@/lib/services/appointment";
import {
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  RescheduleAppointmentDto,
} from "@/types/appointment";

export async function createAppointmentAction(data: CreateAppointmentDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const newAppointment = await createAppointment(data, token);
  revalidatePath("/citas");
  return newAppointment;
}

export async function updateAppointmentStatusAction(
  id: string,
  data: UpdateAppointmentStatusDto
) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const updatedAppointment = await updateAppointmentStatus(id, data, token);
  revalidatePath("/citas");
  revalidatePath(`/citas/${id}`);
  return updatedAppointment;
}

export async function rescheduleAppointmentAction(
  id: string,
  data: RescheduleAppointmentDto
) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const rescheduledAppointment = await rescheduleAppointment(id, data, token);
  revalidatePath("/citas");
  revalidatePath(`/citas/${id}`);
  return rescheduledAppointment;
}

export async function getAppointmentsListAction(params?: { date?: string; staffId?: string; status?: string }) {
  try {
    const token = await getSession();
    if (!token) throw new Error("UNAUTHORIZED");

    const appointments = await getAppointmentsList(token, params);
    return { success: true, data: appointments };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al obtener citas" };
  }
}

