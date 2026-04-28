import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { ProductsTableActions } from "./products-table-actions";

interface ProductsTableProps {
  data: Product[];
}

export function ProductsTable({ data }: ProductsTableProps) {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-semibold text-muted-foreground">#</TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">SKU</TableHead>
            <TableHead className="font-semibold">Laboratorio</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Stock</TableHead>
            <TableHead className="font-semibold">P. Compra</TableHead>
            <TableHead className="font-semibold">P. Venta</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((product, index) => (
              <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell className="text-muted-foreground">{product.laboratory || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{product.type || "—"}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-muted-foreground">
                  S/ {Number(product.purchasePrice ?? 0).toFixed(2)}
                </TableCell>
                <TableCell className="font-semibold">
                  S/ {Number(product.salePrice ?? product.price ?? 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ProductsTableActions product={product} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                No se encontraron productos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
