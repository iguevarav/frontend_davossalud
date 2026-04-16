import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AddAppointmentButton() {
  return (
    <Button asChild>
      <Link href="/citas/nueva">
        <Plus className="mr-2 h-4 w-4" /> Nueva Cita
      </Link>
    </Button>
  );
}
