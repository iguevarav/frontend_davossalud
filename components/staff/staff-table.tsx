import { StaffTableActions } from "./staff-table-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Staff } from "@/types/staff";

interface StaffTableProps {
  data: Staff[];
}

export function StaffTable({ data }: StaffTableProps) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">
              #
            </TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Documento</TableHead>
            <TableHead className="font-semibold">Especialidad</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff, index) => (
            <TableRow
              key={staff.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-muted-foreground font-mono">
                {String(index + 1).padStart(2, "0")}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {staff.user.firstName} {staff.user.lastName}
              </TableCell>
              <TableCell>{staff.document}</TableCell>
              <TableCell>{staff.specialty || "General"}</TableCell>
              <TableCell>{staff.user.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    staff.user.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-50 text-slate-700 border border-slate-200"
                  }`}
                >
                  {staff.user.isActive ? "Activo" : "Inactivo"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <StaffTableActions staff={staff} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
