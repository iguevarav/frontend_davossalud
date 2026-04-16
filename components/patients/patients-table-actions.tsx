"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  UserRoundPenIcon,
  Trash2,
  Eye,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Patient } from "@/types/patient";
import { deletePatientAction } from "@/lib/actions/patient.actions";

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
import { PatientForm } from "./patient-form";
import { toast } from "sonner";

interface PatientsTableActionsProps {
  patient: Patient;
}

export function PatientsTableActions({ patient }: PatientsTableActionsProps) {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsLoading(true);
    setError(null);
    try {
      await deletePatientAction(patient.id);
      toast.success("Paciente eliminado correctamente");
      setDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar paciente");
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
            onClick={() => router.push(`/pacientes/${patient.id}`)}
          >
            <User className="mr-2 h-4 w-4 text-primary" />
            Ir a Perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setViewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setEditOpen(true)}
          >
            <UserRoundPenIcon className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalles del Paciente</DialogTitle>
            <DialogDescription>
              Información registrada de {patient.firstName} {patient.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Documento</Label>
              <div className="col-span-3 text-sm pl-4">{patient.document}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Género</Label>
              <div className="col-span-3 text-sm pl-4 capitalize">{patient.gender.toLowerCase()}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Teléfono</Label>
              <div className="col-span-3 text-sm pl-4">{patient.phone}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">F. Nac.</Label>
              <div className="col-span-3 text-sm pl-4">{patient.birthDate}</div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Dirección</Label>
              <div className="col-span-3 text-sm pl-4">{patient.address}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground font-medium">Correo</Label>
              <div className="col-span-3 text-sm pl-4 truncate">{patient.email || "No registrado"}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">Editar Paciente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Modifique los datos del paciente y guarde los cambios.
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            patient={patient}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente al paciente
            "{patient.firstName} {patient.lastName}" de los registros.
             {error && (
                <p className="text-red-500 mt-2 font-medium">{error}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
