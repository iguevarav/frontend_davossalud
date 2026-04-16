import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const defaultDate = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
    defaultDate
  );
}
