const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchBase(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `Error en la llamada a ${endpoint}`);
  }

  return response.json();
}
