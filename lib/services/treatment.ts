import {
  CreateTreatmentDto,
  Treatment,
  UpdateTreatmentDto,
} from "@/types/treatment";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTreatmentsList(token: string): Promise<Treatment[]> {
  const response = await fetch(`${BASE_URL}/treatments`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Error al obtener la lista de tratamientos",
    );
  }

  return response.json();
}

export async function createTreatment(
  data: CreateTreatmentDto,
  token: string,
): Promise<Treatment> {
  const response = await fetch(`${BASE_URL}/treatments`, {
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
    throw new Error(error.message || "Error al crear el tratamiento");
  }

  return response.json();
}

export async function updateTreatment(
  id: string,
  data: UpdateTreatmentDto,
  token: string,
): Promise<Treatment> {
  const response = await fetch(`${BASE_URL}/treatments/${id}`, {
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
    throw new Error(error.message || "Error al actualizar el tratamiento");
  }

  return response.json();
}

export async function deleteTreatment(id: string, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/treatments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al eliminar el tratamiento");
  }
}
