import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient } from "@/types/patient";
import { PatientsTableActions } from "./patients-table-actions";

interface PatientsTableProps {
  data: Patient[];
}

export function PatientsTable({ data }: PatientsTableProps) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">
              #
            </TableHead>
            <TableHead className="font-semibold">Paciente</TableHead>
            <TableHead className="font-semibold">Documento</TableHead>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableHead className="font-semibold">F. Nacimiento</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((patient, index) => (
              <TableRow
                key={patient.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {patient.firstName} {patient.lastName}
                </TableCell>
                <TableCell>{patient.document}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.birthDate}</TableCell>
                <TableCell className="text-right">
                  <PatientsTableActions patient={patient} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No se encontraron pacientes registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
