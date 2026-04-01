import { User } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(token: string, filters?: { withoutStaff?: boolean }): Promise<User[]> {
  const queryParams = new URLSearchParams();
  if (filters?.withoutStaff) {
    queryParams.append("withoutStaff", "true");
  }

  const response = await fetch(`${BASE_URL}/users?${queryParams.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: 'no-store'
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener la lista de usuarios");
  }

  return response.json();
}
