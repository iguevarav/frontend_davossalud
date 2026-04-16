import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getAppointmentsList } from "@/lib/services/appointment";
import { AppointmentsTable } from "@/components/appointments/appointments-table";
import { AddAppointmentButton } from "@/components/appointments/add-appointment-button";
import { Appointment } from "@/types/appointment";

export default async function AppointmentsPage(props: {
  searchParams: Promise<{ date?: string; staffId?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const token = await getSession();
  let appointments: Appointment[] = [];

  if (token) {
    try {
      appointments = await getAppointmentsList(token, searchParams);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      throw error;
    }
  } else {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas</h1>
          <p className="text-muted-foreground mt-1">
            Administre la agenda, reserve y gestione las citas de la clínica.
          </p>
        </div>
        <AddAppointmentButton />
      </div>

      <div className="w-full">
        <AppointmentsTable data={appointments} />
      </div>
    </div>
  );
}
