"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createPatientAction, updatePatientAction } from "@/lib/actions/patient.actions";
import { Gender, BloodType, Patient } from "@/types/patient";

const formSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  document: z.string().min(5, "El documento debe tener al menos 5 caracteres"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  gender: z.enum(Gender),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 números").max(15, "El teléfono es muy largo"),
  address: z.string().optional().or(z.literal("")),
  additionalNote: z.string().optional().or(z.literal("")),
  bloodType: z.enum(BloodType).optional().or(z.literal("")),
  allergies: z.string().optional().or(z.literal("")),
  chronicDiseases: z.string().optional().or(z.literal("")),
});

interface PatientFormProps {
  patient?: Patient;
  onSuccess?: () => void;
}

export function PatientForm({ patient, onSuccess }: PatientFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      document: patient?.document || "",
      birthDate: patient?.birthDate || "",
      gender: patient?.gender || undefined,
      phone: patient?.phone || "",
      address: patient?.address || "",
      additionalNote: patient?.additionalNote || "",
      bloodType: patient?.bloodType || "",
      allergies: patient?.allergies || "",
      chronicDiseases: patient?.chronicDiseases || "",
    },
  });

  async function onSubmit(values: any) {
    setIsLoading(true);
    try {
      if (patient) {
        await updatePatientAction(patient.id, values);
        toast.success("Paciente actualizado correctamente");
      } else {
        await createPatientAction(values);
        toast.success("Paciente registrado correctamente");
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Información Personal ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
          Información Personal
        </h3>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nombres</FieldLabel>
                  <Input {...field} id={field.name} placeholder="Juan" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Apellidos</FieldLabel>
                  <Input {...field} id={field.name} placeholder="Perez" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="document"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Documento</FieldLabel>
                  <Input {...field} id={field.name} placeholder="DNI / CE" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="birthDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Fecha de Nacimiento</FieldLabel>
                  <Input {...field} id={field.name} type="date" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Género</FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Masculino</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Femenino</SelectItem>
                      <SelectItem value={Gender.OTHER}>Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="bloodType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Grupo Sanguíneo</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BloodType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
                  <Input {...field} id={field.name} placeholder="987654321" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
                  <Input {...field} id={field.name} placeholder="Av. Siempre Viva 123" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* Nota Adicional — en Información Personal */}
          <Controller
            name="additionalNote"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nota Adicional</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Observaciones adicionales del paciente..."
                  rows={3}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      {/* ── Información Médica ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
          Información Médica
        </h3>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alergias — resaltado en rojo */}
            <Controller
              name="allergies"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Alergias
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Penicilina, látex..."
                    className="border-red-200 focus-visible:ring-red-400 dark:border-red-900"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Condiciones Crónicas — resaltado en rojo */}
            <Controller
              name="chronicDiseases"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Condiciones Crónicas
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Diabetes, hipertensión..."
                    className="border-red-200 focus-visible:ring-red-400 dark:border-red-900"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : patient ? "Guardar Cambios" : "Registrar Paciente"}
        </Button>
      </div>
    </form>
  );
}
