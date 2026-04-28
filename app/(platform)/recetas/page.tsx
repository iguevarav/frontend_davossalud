import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/auth.actions";
import { getRecipesList } from "@/lib/services/recipe";
import { getPatientsList } from "@/lib/services/patient";
import { getStaffList } from "@/lib/services/staff";
import { Recipe } from "@/types/recipe";
import { Patient } from "@/types/patient";
import { Staff } from "@/types/staff";
import { AddRecipeButton } from "@/components/recipes/add-recipe-button";
import { RecipesTable } from "@/components/recipes/recipes-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function RecipesPage() {
  const token = await getSession();
  let recipes: Recipe[] = [];
  let patients: Patient[] = [];
  let staffMembers: Staff[] = [];
  let errorMessage: string | null = null;

  if (token) {
    try {
      [recipes, patients, staffMembers] = await Promise.all([
        getRecipesList(token),
        getPatientsList(token),
        getStaffList(token),
      ]);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      errorMessage = error.message || "No se pudo cargar el módulo de recetas.";
    }
  } else {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recetas</h1>
          <p className="text-muted-foreground mt-1">
            Registre recetas de forma guiada y genere un PDF clínico en media hoja.
          </p>
        </div>
        <AddRecipeButton patients={patients} staffMembers={staffMembers} />
      </div>

      {errorMessage ? (
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar recetas</CardTitle>
            <CardDescription>
              El backend respondió con error y la página evitó romper el render.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {errorMessage}
          </CardContent>
        </Card>
      ) : (
        <RecipesTable data={recipes} />
      )}
    </div>
  );
}
