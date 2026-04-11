"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createScheduleAction } from "@/lib/actions/schedule.actions";

export function AddScheduleButton({ staffId }: { staffId: string }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    const dataToCreate = {
      staffId,
      date,
      startTime,
      endTime,
    };

    try {
      const result = await createScheduleAction(dataToCreate, staffId);
      if (!result.success) {
        throw new Error(result.error);
      }
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shadow-sm">
        <Plus className="h-4 w-4 mr-2" />
        Añadir Turno
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-8">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Turno</DialogTitle>
            <DialogDescription>
              Asigne un nuevo bloque de horario para este médico.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right font-medium">
                  Fecha
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="col-span-3 ml-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right font-medium">
                  Hora Inicio
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  className="col-span-3 ml-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right font-medium">
                  Hora Fin
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  className="col-span-3 ml-2"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center col-span-4 font-medium px-4">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Turno"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
