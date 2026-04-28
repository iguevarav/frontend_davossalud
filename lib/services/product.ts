import { CreateProductDto, Product, UpdateProductDto } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductsList(token: string): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener la lista de productos");
  }

  return response.json();
}

export async function createProduct(
  data: CreateProductDto,
  token: string,
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el producto");
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  data: UpdateProductDto,
  token: string,
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el producto");
  }

  return response.json();
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al eliminar el producto");
  }
}
