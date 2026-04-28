"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  PenIcon,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { updateAppointmentStatusAction } from "@/lib/actions/appointment.actions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AppointmentsTableActionsProps {
  appointment: Appointment;
}

export function AppointmentsTableActions({ appointment }: AppointmentsTableActionsProps) {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setIsLoading(true);
    setError(null);
    try {
      await updateAppointmentStatusAction(appointment.id, {
        status: AppointmentStatus.CANCELLED,
      });
      toast.success("Cita cancelada correctamente");
      setCancelOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Error al cancelar la cita");
      setError(err.message || "Error al cancelar la cita");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Opciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setViewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalles
          </DropdownMenuItem>

          {/* Si queremos editar la cita */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/citas/${appointment.id}/editar`)}
          >
            <PenIcon className="mr-2 h-4 w-4" />
            Editar / Reprogramar
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={() => setCancelOpen(true)}
            disabled={appointment.status === AppointmentStatus.CANCELLED}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancelar Cita
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalles de la Cita</DialogTitle>
            <DialogDescription>
              Información de la cita el {appointment.date}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Paciente</Label>
              <div className="col-span-3 text-sm pl-4">{appointment.patient.firstName} {appointment.patient.lastName}</div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Doc.</Label>
              <div className="col-span-3 text-sm pl-4">{appointment.patient.document}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Especialista</Label>
              <div className="col-span-3 text-sm pl-4">
                {appointment.staff?.user
                  ? `${appointment.staff.user.firstName} ${appointment.staff.user.lastName}`
                  : "Sin asignar"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Fecha</Label>
              <div className="col-span-3 text-sm pl-4">{appointment.date}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Horario</Label>
              <div className="col-span-3 text-sm pl-4">{appointment.startTime ? `${appointment.startTime} - ${appointment.endTime}` : "Por coordinar"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Estado</Label>
              <div className="col-span-3 text-sm pl-4">{appointment.status}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de cancelar esta cita?</AlertDialogTitle>
            <AlertDialogDescription>
              La cita pasará a estado "Cancelada". Esta acción notificará al paciente si tuviera un sistema de notificaciones activo.
             {error && (
                <p className="text-red-500 mt-2 font-medium">{error}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cerrar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading ? "Cancelando..." : "Sí, Cancelar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
