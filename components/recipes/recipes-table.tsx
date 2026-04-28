import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Recipe } from "@/types/recipe";
import { RecipesTableActions } from "./recipes-table-actions";

interface RecipesTableProps {
  data: Recipe[];
}

export function RecipesTable({ data }: RecipesTableProps) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">#</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Paciente</TableHead>
            <TableHead className="font-semibold">Especialista</TableHead>
            <TableHead className="font-semibold">Diagnóstico</TableHead>
            <TableHead className="font-semibold">Items</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((recipe, index) => (
              <TableRow key={recipe.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>{recipe.prescribedAt}</TableCell>
                <TableCell className="font-medium">
                  {recipe.patient.firstName} {recipe.patient.lastName}
                </TableCell>
                <TableCell>
                  {recipe.staff.user.firstName} {recipe.staff.user.lastName}
                </TableCell>
                <TableCell className="max-w-[220px] truncate">{recipe.diagnosis}</TableCell>
                <TableCell>{recipe.items.length}</TableCell>
                <TableCell className="text-right">
                  <RecipesTableActions recipe={recipe} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No se encontraron recetas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
