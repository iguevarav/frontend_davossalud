"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/actions/auth.actions";
import { createRecipe, deleteRecipe } from "@/lib/services/recipe";
import { CreateRecipeDto } from "@/types/recipe";

export async function createRecipeAction(data: CreateRecipeDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const recipe = await createRecipe(data, token);
  revalidatePath("/recetas");
  return recipe;
}

export async function deleteRecipeAction(id: string) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  await deleteRecipe(id, token);
  revalidatePath("/recetas");
}
