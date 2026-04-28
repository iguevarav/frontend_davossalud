import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MedicalRecord } from "@/types/medical-record";
import { MedicalRecordTableActions } from "./medical-record-table-actions";

interface Props {
  data: MedicalRecord[];
}

export function MedicalRecordsTable({ data }: Props) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">#</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Paciente</TableHead>
            <TableHead className="font-semibold">Especialista</TableHead>
            <TableHead className="font-semibold">CIE-10</TableHead>
            <TableHead className="font-semibold">Motivo</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((record, index) => (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-mono text-sm">{record.date}</TableCell>
                <TableCell className="font-medium">
                  {record.patient
                    ? `${record.patient.firstName} ${record.patient.lastName}`
                    : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {record.staff?.user
                    ? `Dr. ${record.staff.user.firstName} ${record.staff.user.lastName}`
                    : "—"}
                </TableCell>
                <TableCell>
                  {record.cie10 ? (
                    <Badge variant="outline" className="font-mono text-xs">
                      {record.cie10}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">
                  {record.reason || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <MedicalRecordTableActions record={record} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No se encontraron historias clínicas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
