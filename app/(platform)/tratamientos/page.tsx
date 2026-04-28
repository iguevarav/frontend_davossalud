import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getTreatmentsList } from "@/lib/services/treatment";
import { AddTreatmentButton } from "@/components/treatments/add-treatment-button";
import { TreatmentsTable } from "@/components/treatments/treatments-table";
import { Treatment } from "@/types/treatment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TreatmentsPage() {
  const token = await getSession();
  let treatments: Treatment[] = [];
  let errorMessage: string | null = null;

  if (token) {
    try {
      treatments = await getTreatmentsList(token);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      errorMessage =
        error.message || "No se pudo cargar la lista de tratamientos.";
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Tratamientos</h1>
          <p className="text-muted-foreground mt-1">
            Administre los tratamientos disponibles para la clínica.
          </p>
        </div>
        <AddTreatmentButton />
      </div>

      <div className="w-full">
        {errorMessage ? (
          <Card>
            <CardHeader>
              <CardTitle>No se pudo cargar los tratamientos</CardTitle>
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
          <TreatmentsTable data={treatments} />
        )}
      </div>
    </div>
  );
}
