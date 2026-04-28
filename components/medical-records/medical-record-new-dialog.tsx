"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedicalRecordForm } from "./medical-record-form";

export function MedicalRecordNewDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Consulta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Registrar Consulta</DialogTitle>
          <DialogDescription>
            Complete los datos de la historia clínica del paciente.
          </DialogDescription>
        </DialogHeader>
        <MedicalRecordForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
