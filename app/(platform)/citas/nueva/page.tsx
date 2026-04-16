import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getPatientsList } from "@/lib/services/patient";
import { getStaffList } from "@/lib/services/staff";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { Patient } from "@/types/patient";
import { Staff } from "@/types/staff";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function NewAppointmentPage() {
  const token = await getSession();
  let patients: Patient[] = [];
  let staffMembers: Staff[] = [];

  if (token) {
    try {
      patients = await getPatientsList(token);
      staffMembers = await getStaffList(token);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      // Si falla la carga, podríamos redirigir o mostrar un error
      console.error(error);
    }
  } else {
    redirect("/login");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Agendar Nueva Cita</h1>
        <p className="text-muted-foreground mt-1">
          Complete los datos para registrar una nueva reserva.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Cita</CardTitle>
          <CardDescription>
            Asegúrese de verificar la disponibilidad del especialista antes de confirmar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm patients={patients} staffMembers={staffMembers} />
        </CardContent>
      </Card>
    </div>
  );
}
