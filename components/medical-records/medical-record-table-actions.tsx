"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { MedicalRecord } from "@/types/medical-record";
import { MedicalRecordForm } from "./medical-record-form";
import { deleteMedicalRecordAction } from "@/lib/actions/medical-record.actions";

interface Props {
  record: MedicalRecord;
}

export function MedicalRecordTableActions({ record }: Props) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteMedicalRecordAction(record.id);
      toast.success("Historia clínica eliminada");
      setDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    } finally {
      setIsLoading(false);
    }
  }

  const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) =>
    value ? (
      <div className="grid grid-cols-4 items-start gap-3">
        <Label className="text-right text-muted-foreground font-medium text-xs pt-0.5">{label}</Label>
        <div className="col-span-3 text-sm whitespace-pre-wrap">{value}</div>
      </div>
    ) : null;

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
          <DropdownMenuItem className="cursor-pointer" onClick={() => setViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> Ver detalle
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Vista */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Historia Clínica</DialogTitle>
            <DialogDescription>
              {record.date} —{" "}
              {record.patient
                ? `${record.patient.firstName} ${record.patient.lastName}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Signos vitales */}
            {(record.weight || record.height || record.bloodPressure || record.temperature || record.heartRate) && (
              <div className="rounded-lg bg-muted/40 p-4 grid grid-cols-5 gap-3 text-center">
                {record.weight && <div><p className="text-xs text-muted-foreground">Peso</p><p className="font-semibold">{record.weight} kg</p></div>}
                {record.height && <div><p className="text-xs text-muted-foreground">Talla</p><p className="font-semibold">{record.height} cm</p></div>}
                {record.bloodPressure && <div><p className="text-xs text-muted-foreground">P. Art.</p><p className="font-semibold">{record.bloodPressure}</p></div>}
                {record.temperature && <div><p className="text-xs text-muted-foreground">Temp.</p><p className="font-semibold">{record.temperature}°C</p></div>}
                {record.heartRate && <div><p className="text-xs text-muted-foreground">FC</p><p className="font-semibold">{record.heartRate} lpm</p></div>}
              </div>
            )}
            <div className="grid gap-3">
              <InfoRow label="CIE-10" value={record.cie10} />
              <InfoRow label="Motivo" value={record.reason} />
              <InfoRow label="Anamnesis" value={record.anamnesis} />
              <InfoRow label="Examen Físico" value={record.physicalExam} />
              <InfoRow label="Diagnóstico" value={record.diagnosis} />
              <InfoRow label="Tratamiento" value={record.treatment} />
              <InfoRow label="Observaciones" value={record.observations} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewOpen(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">Editar Historia Clínica</DialogTitle>
            <DialogDescription>Modifique los datos de la consulta.</DialogDescription>
          </DialogHeader>
          <MedicalRecordForm record={record} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Eliminar */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar historia clínica?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la consulta del {record.date}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
