import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getProductsList } from "@/lib/services/product";
import { AddProductButton } from "@/components/products/add-product-button";
import { ProductsTable } from "@/components/products/products-table";
import { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProductsPage() {
  const token = await getSession();
  let products: Product[] = [];
  let errorMessage: string | null = null;

  if (token) {
    try {
      products = await getProductsList(token);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      errorMessage = error.message || "No se pudo cargar la lista de productos.";
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-muted-foreground mt-1">
            Administre los productos y stock disponibles para la clínica.
          </p>
        </div>
        <AddProductButton />
      </div>

      <div className="w-full">
        {errorMessage ? (
          <Card>
            <CardHeader>
              <CardTitle>No se pudo cargar los productos</CardTitle>
              <CardDescription>
                El backend no respondió correctamente y la página evitó romper el
                render del servidor.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {errorMessage}
            </CardContent>
          </Card>
        ) : (
          <ProductsTable data={products} />
        )}
      </div>
    </div>
  );
}
