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
import { CashEntryForm } from "./cash-entry-form";

export function CashNewDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Movimiento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Registrar Movimiento</DialogTitle>
          <DialogDescription>
            Ingrese los datos del ingreso o egreso de caja.
          </DialogDescription>
        </DialogHeader>
        <CashEntryForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
