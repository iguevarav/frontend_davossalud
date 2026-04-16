"use client";

import { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { createAppointmentAction, getAppointmentsListAction } from "@/lib/actions/appointment.actions";
import { getSchedulesByStaffIdAction } from "@/lib/actions/schedule.actions";
import { Patient } from "@/types/patient";
import { Staff } from "@/types/staff";
import { Role } from "@/types/user";
import { Schedule } from "@/types/schedule";
import { Appointment } from "@/types/appointment";

function timeToMins(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minsToTime(mins: number) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

interface Slot {
  startTime: string;
  endTime: string;
  scheduleId: string;
  available: boolean;
}

const formSchema = z
  .object({
    patientId: z.string().min(1, "Seleccione un paciente"),
    staffId: z.string().min(1, "Seleccione un especialista"),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
    coordinateLater: z.boolean(),
    duration: z.string().optional(),
    startTime: z.string().optional(),
    scheduleId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.coordinateLater) {
      if (!data.duration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Seleccione la duración",
          path: ["duration"],
        });
      }
      if (!data.startTime || !data.scheduleId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Seleccione un bloque de horario disponible",
          path: ["startTime"],
        });
      }
    }
  });

interface AppointmentFormProps {
  patients: Patient[];
  staffMembers: Staff[];
  onSuccess?: () => void;
}

export function AppointmentForm({
  patients,
  staffMembers,
  onSuccess,
}: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      staffId: "",
      date: "",
      coordinateLater: false,
      startTime: "",
      duration: "",
      scheduleId: "",
    },
  });

  const coordinateLater = form.watch("coordinateLater");
  const staffId = form.watch("staffId");
  const date = form.watch("date");
  const durationStr = form.watch("duration");
  const _startTime = form.watch("startTime");
  const _scheduleId = form.watch("scheduleId");

  useEffect(() => {
    async function loadAvailability() {
      if (!staffId || !date || coordinateLater) {
        setSchedules([]);
        setAppointments([]);
        return;
      }
      
      setFetchingSlots(true);
      try {
        const [schedRes, appRes] = await Promise.all([
          getSchedulesByStaffIdAction(staffId, date),
          getAppointmentsListAction({ staffId, date, status: "CONFIRMED" })
        ]);
        if (schedRes.success) setSchedules(schedRes.data || []);
        if (appRes.success) setAppointments(appRes.data || []);
        
        // Reset selected slot if schedules change
        form.setValue("startTime", "");
        form.setValue("scheduleId", "");
      } catch (error) {
         toast.error("Error al cargar la disponibilidad");
      } finally {
        setFetchingSlots(false);
      }
    }

    loadAvailability();
  }, [staffId, date, coordinateLater, form]);

  const availableSlotsGrouped = useMemo(() => {
    const durationMins = parseInt(durationStr || "0");
    if (!durationMins || schedules.length === 0) return {};

    const grouped: Record<string, { title: string; slots: Slot[] }> = {};

    schedules.forEach(schedule => {
       const slots: Slot[] = [];
       let currentMins = timeToMins(schedule.startTime);
       const endMins = timeToMins(schedule.endTime);

       while (currentMins + durationMins <= endMins) {
          const slotStart = currentMins;
          const slotEnd = currentMins + durationMins;

          const hasConflict = appointments.some(app => {
             if (!app.startTime) return false;
             const appStart = timeToMins(app.startTime);
             const appEnd = app.endTime ? timeToMins(app.endTime) : appStart + (app.duration || 0);

             return appStart < slotEnd && appEnd > slotStart;
          });

          slots.push({
             startTime: minsToTime(slotStart),
             endTime: minsToTime(slotEnd),
             scheduleId: schedule.id,
             available: !hasConflict
          });

          // advance 30 mins
          currentMins += 30;
       }
       
       if (slots.length > 0) {
         grouped[schedule.id] = {
            title: `Turno ${schedule.startTime} - ${schedule.endTime}`,
            slots
         };
       }
    });

    return grouped;
  }, [schedules, appointments, durationStr]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload: any = {
        patientId: values.patientId,
        staffId: values.staffId,
        date: values.date,
      };

      if (!values.coordinateLater) {
        payload.startTime = values.startTime;
        payload.duration = parseInt(values.duration || "0");
        payload.scheduleId = values.scheduleId;
      }

      await createAppointmentAction(payload);
      toast.success("Cita registrada correctamente");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/citas");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  }

  const durationOptions = Array.from({ length: 8 }, (_, i) => (i + 1) * 30);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="patientId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Paciente</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seleccione un paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} - {p.document}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="staffId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Especialista</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seleccione especialista" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers
                      .filter((s) => s.user.roles.includes(Role.DOCTOR))
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.user.firstName} {s.user.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Fecha de la Cita</FieldLabel>
                <Input {...field} id={field.name} type="date" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {!coordinateLater && (
            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Duración</FieldLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("startTime", "");
                      form.setValue("scheduleId", "");
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Seleccione duración" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((dur) => (
                        <SelectItem key={dur} value={dur.toString()}>
                          {dur} minutos ({dur / 60} horas)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </div>

        <div className="py-4">
          <Controller
            name="coordinateLater"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Switch
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={(val) => {
                    field.onChange(val);
                    if (val) {
                      form.setValue("startTime", "");
                      form.setValue("duration", "");
                      form.setValue("scheduleId", "");
                    }
                  }}
                />
                <FieldLabel
                  htmlFor={field.name}
                  className="cursor-pointer mb-0"
                >
                  Coordinar hora después
                </FieldLabel>
              </div>
            )}
          />
        </div>

        {!coordinateLater && staffId && date && durationStr && (
           <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Selección de Horario</h3>
              {fetchingSlots ? (
                 <p className="text-sm text-gray-500">Cargando disponibilidad...</p>
              ) : Object.keys(availableSlotsGrouped).length === 0 ? (
                 <p className="text-sm text-amber-600">No hay turnos disponibles para esta fecha o la duración excede los bloques libres.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(availableSlotsGrouped).map(([schId, group]) => (
                    <div key={schId} className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">{group.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.slots.map((slot) => {
                          const isSelected = _startTime === slot.startTime && _scheduleId === slot.scheduleId;
                          
                          return (
                            <button
                              key={`${slot.startTime}-${slot.endTime}`}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                form.setValue("startTime", slot.startTime);
                                form.setValue("scheduleId", slot.scheduleId);
                                form.clearErrors("startTime");
                              }}
                              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                !slot.available 
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : isSelected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {form.formState.errors.startTime && (
                    <p className="text-sm font-medium text-destructive mt-2">
                       {form.formState.errors.startTime.message}
                    </p>
                  )}
                </div>
              )}
           </div>
        )}
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={() => router.push("/citas")}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Agendar Cita"}
        </Button>
      </div>
    </form>
  );
}
