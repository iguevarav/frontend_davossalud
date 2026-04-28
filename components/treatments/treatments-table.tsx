import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Treatment } from "@/types/treatment";
import { TreatmentsTableActions } from "./treatments-table-actions";

interface TreatmentsTableProps {
  data: Treatment[];
}

export function TreatmentsTable({ data }: TreatmentsTableProps) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">#</TableHead>
            <TableHead className="font-semibold">Tratamiento</TableHead>
            <TableHead className="font-semibold">Duración</TableHead>
            <TableHead className="font-semibold">Precio</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((treatment, index) => (
              <TableRow key={treatment.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-medium text-foreground">{treatment.name}</TableCell>
                <TableCell>
                  {treatment.durationMinutes ? `${treatment.durationMinutes} min` : "Sin definir"}
                </TableCell>
                <TableCell>S/ {Number(treatment.price).toFixed(2)}</TableCell>
                <TableCell>{treatment.isActive ? "Activo" : "Inactivo"}</TableCell>
                <TableCell className="text-right">
                  <TreatmentsTableActions treatment={treatment} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No se encontraron tratamientos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
