"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  createMedicalRecordAction,
  updateMedicalRecordAction,
} from "@/lib/actions/medical-record.actions";
import { MedicalRecord } from "@/types/medical-record";

const schema = z.object({
  patientId: z.string().uuid("ID de paciente inválido"),
  staffId: z.string().uuid("ID de especialista inválido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
  anamnesis: z.string().optional(),
  physicalExam: z.string().optional(),
  cie10: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  observations: z.string().optional(),
  weight: z.coerce.number().min(0).max(500).optional(),
  height: z.coerce.number().min(0).max(300).optional(),
  bloodPressure: z.string().optional(),
  temperature: z.coerce.number().min(30).max(45).optional(),
  heartRate: z.coerce.number().min(0).max(300).optional(),
});

type FormValues = {
  patientId: string;
  staffId: string;
  date: string;
  reason?: string;
  anamnesis?: string;
  physicalExam?: string;
  cie10?: string;
  diagnosis?: string;
  treatment?: string;
  observations?: string;
  weight?: number | string;
  height?: number | string;
  bloodPressure?: string;
  temperature?: number | string;
  heartRate?: number | string;
};

interface Props {
  record?: MedicalRecord;
  defaultPatientId?: string;
  defaultStaffId?: string;
  onSuccess?: () => void;
}

export function MedicalRecordForm({ record, defaultPatientId, defaultStaffId, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      patientId: record?.patientId || defaultPatientId || "",
      staffId: record?.staffId || defaultStaffId || "",
      date: record?.date || today,
      reason: record?.reason || "",
      anamnesis: record?.anamnesis || "",
      physicalExam: record?.physicalExam || "",
      cie10: record?.cie10 || "",
      diagnosis: record?.diagnosis || "",
      treatment: record?.treatment || "",
      observations: record?.observations || "",
      weight: record?.weight as any,
      height: record?.height as any,
      bloodPressure: record?.bloodPressure || "",
      temperature: record?.temperature as any,
      heartRate: record?.heartRate as any,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        reason: values.reason || undefined,
        anamnesis: values.anamnesis || undefined,
        physicalExam: values.physicalExam || undefined,
        cie10: values.cie10 || undefined,
        diagnosis: values.diagnosis || undefined,
        treatment: values.treatment || undefined,
        observations: values.observations || undefined,
        bloodPressure: values.bloodPressure || undefined,
        weight: values.weight !== "" && values.weight !== undefined ? Number(values.weight) : undefined,
        height: values.height !== "" && values.height !== undefined ? Number(values.height) : undefined,
        temperature: values.temperature !== "" && values.temperature !== undefined ? Number(values.temperature) : undefined,
        heartRate: values.heartRate !== "" && values.heartRate !== undefined ? Number(values.heartRate) : undefined,
      };
      if (record) {
        await updateMedicalRecordAction(record.id, payload);
        toast.success("Historia clínica actualizada");
      } else {
        await createMedicalRecordAction(payload);
        toast.success("Historia clínica registrada");
      }
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos básicos */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
          Datos de la Consulta
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Fecha</FieldLabel>
                <Input {...field} id={field.name} type="date" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="cie10"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Código CIE-10</FieldLabel>
                <Input {...field} id={field.name} placeholder="J06, K29.5..." />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Motivo de Consulta</FieldLabel>
              <Input {...field} id={field.name} placeholder="Dolor abdominal de 3 días..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* Signos Vitales */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
          Signos Vitales
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { name: "weight" as const, label: "Peso (kg)", placeholder: "70" },
            { name: "height" as const, label: "Talla (cm)", placeholder: "170" },
            { name: "bloodPressure" as const, label: "P. Arterial", placeholder: "120/80", isText: true },
            { name: "temperature" as const, label: "Temp. (°C)", placeholder: "36.5" },
            { name: "heartRate" as const, label: "FC (lpm)", placeholder: "75" },
          ].map(({ name, label, placeholder, isText }) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name} className="text-xs">{label}</FieldLabel>
                  <Input
                    {...field}
                    id={name}
                    type={isText ? "text" : "number"}
                    step="0.1"
                    placeholder={placeholder}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
        </div>
      </div>

      {/* Clínica */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
          Evaluación Clínica
        </h4>
        <FieldGroup>
          {[
            { name: "anamnesis" as const, label: "Anamnesis", placeholder: "Historia de la enfermedad actual..." },
            { name: "physicalExam" as const, label: "Examen Físico", placeholder: "Inspección, palpación, percusión, auscultación..." },
            { name: "diagnosis" as const, label: "Diagnóstico", placeholder: "Diagnóstico principal y secundarios..." },
            { name: "treatment" as const, label: "Tratamiento", placeholder: "Indicaciones médicas y terapéuticas..." },
            { name: "observations" as const, label: "Observaciones", placeholder: "Indicaciones adicionales, próxima cita..." },
          ].map(({ name, label, placeholder }) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>{label}</FieldLabel>
                  <Textarea {...field} id={name} placeholder={placeholder} rows={3} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
        </FieldGroup>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : record ? "Actualizar" : "Registrar Consulta"}
        </Button>
      </div>
    </form>
  );
}
