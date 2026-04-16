import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { AppointmentsTableActions } from "./appointments-table-actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface AppointmentsTableProps {
  data: Appointment[];
}

const statusMap: Record<AppointmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  [AppointmentStatus.PENDING_CONFIRMATION]: { label: "Pendiente", variant: "warning" },
  [AppointmentStatus.CONFIRMED]: { label: "Confirmada", variant: "success" },
  [AppointmentStatus.ATTENDED]: { label: "Atendida", variant: "default" },
  [AppointmentStatus.CANCELLED]: { label: "Cancelada", variant: "destructive" },
  [AppointmentStatus.RESCHEDULED]: { label: "Reprogramada", variant: "secondary" },
};

function getStatusBadge(status: AppointmentStatus) {
  const mapping = statusMap[status] || { label: status, variant: "outline" };
  
  let colorClass = "";
  if (mapping.variant === "warning") colorClass = "bg-yellow-500 hover:bg-yellow-600 text-white";
  if (mapping.variant === "success") colorClass = "bg-green-500 hover:bg-green-600 text-white";

  return (
    <Badge variant={["success", "warning"].includes(mapping.variant) ? "default" : (mapping.variant as any)} className={colorClass}>
      {mapping.label}
    </Badge>
  );
}

export function AppointmentsTable({ data }: AppointmentsTableProps) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">
              #
            </TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Horario</TableHead>
            <TableHead className="font-semibold">Paciente</TableHead>
            <TableHead className="font-semibold">Especialista</TableHead>
            <TableHead className="font-semibold cursor-pointer">Estado</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((appointment, index) => (
              <TableRow
                key={appointment.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-medium text-foreground capitalize">
                  {formatDate(appointment.date)}
                </TableCell>
                <TableCell>
                  {appointment.startTime ? `${appointment.startTime} - ${appointment.endTime}` : "Por coordinar"}
                </TableCell>
                <TableCell>
                  {appointment.patient?.firstName} {appointment.patient?.lastName}
                </TableCell>
                <TableCell>
                  {appointment.staff?.user ? `${appointment.staff.user.firstName} ${appointment.staff.user.lastName}` : "Sin asignar"}
                </TableCell>
                <TableCell>
                  {getStatusBadge(appointment.status)}
                </TableCell>
                <TableCell className="text-right">
                  <AppointmentsTableActions appointment={appointment} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No se encontraron citas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
