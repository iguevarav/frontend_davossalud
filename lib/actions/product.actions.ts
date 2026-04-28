"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/actions/auth.actions";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/services/product";
import { CreateProductDto, UpdateProductDto } from "@/types/product";

export async function createProductAction(data: CreateProductDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const product = await createProduct(data, token);
  revalidatePath("/productos");
  return product;
}

export async function updateProductAction(id: string, data: UpdateProductDto) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const product = await updateProduct(id, data, token);
  revalidatePath("/productos");
  return product;
}

export async function deleteProductAction(id: string) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  await deleteProduct(id, token);
  revalidatePath("/productos");
}
