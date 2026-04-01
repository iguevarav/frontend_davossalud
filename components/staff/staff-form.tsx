"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createStaffAction } from "@/lib/actions/staff.actions";
import { getUsersAction } from "@/lib/actions/user.actions";
import { User } from "@/types/auth";

const formSchema = z.object({
  userId: z.string().min(1, "El usuario es requerido"),
  document: z
    .string()
    .min(1, "El documento es requerido")
    .regex(/^\d{8}$/, "El documento debe tener exactamente 8 números"),
  phone: z
    .string()
    .regex(/^\d{9}$/, "El teléfono debe tener exactamente 9 números")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  profilePhoto: z.string().optional(),
  specialty: z.string().optional(),
});

interface StaffFormProps {
  onSuccess?: () => void;
}

export function StaffForm({ onSuccess }: StaffFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      document: "",
      phone: "",
      address: "",
      profilePhoto: "",
      specialty: "",
    },
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const availableUsers = await getUsersAction({ withoutStaff: true });
        setUsers(availableUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error al cargar los usuarios disponibles");
      }
    }
    fetchUsers();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createStaffAction(values);
      toast.success("Personal registrado correctamente");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el personal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form id="staff-registration-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="userId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Usuario</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id={field.name} data-invalid={fieldState.invalid} className="w-full">
                  <SelectValue placeholder="Seleccione un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No hay usuarios disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FieldDescription>
                Solo se muestran usuarios que aún no tienen personal asignado.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Documento */}
        <Controller
          name="document"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Documento de Identidad</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ej: 12345678"
                autoComplete="off"
                maxLength={8}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Teléfono y Especialidad en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ej: 987654321"
                  maxLength={9}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="specialty"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Especialidad</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ej: Cardiología"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Dirección */}
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Av. Principal 123"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Foto de Perfil */}
        <Controller
          name="profilePhoto"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Foto de Perfil (URL)</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="https://ejemplo.com/foto.jpg"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrar Personal"}
        </Button>
      </div>
    </form>
  );
}
