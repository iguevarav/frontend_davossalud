"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Schedule } from "@/types/schedule";
import { ScheduleTableActions } from "./schedule-table-actions";

interface ScheduleTableProps {
  data: Schedule[];
}

export function ScheduleTable({ data }: ScheduleTableProps) {
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}:00`);
    const dateB = new Date(`${b.date}T${b.startTime}:00`);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateString: string) => {
    const defaultDate = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
      defaultDate,
    );
  };

  if (sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-card/50">
        <p className="text-muted-foreground font-medium">
          Este miembro del personal no tiene turnos registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold ">Fecha</TableHead>
            <TableHead className="font-semibold ">Hora Inicio</TableHead>
            <TableHead className="font-semibold ">Hora Fin</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((schedule) => (
            <TableRow
              key={schedule.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium text-foreground capitalize">
                {formatDate(schedule.date)}
              </TableCell>
              <TableCell>{schedule.startTime}</TableCell>
              <TableCell>{schedule.endTime}</TableCell>
              <TableCell className="text-right">
                <ScheduleTableActions schedule={schedule} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
