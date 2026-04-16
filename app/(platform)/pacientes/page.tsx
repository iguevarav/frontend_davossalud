import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getPatientsList } from "@/lib/services/patient";
import { PatientsTable } from "@/components/patients/patients-table";
import { AddPatientButton } from "@/components/patients/add-patient-button";
import { Patient } from "@/types/patient";

export default async function PatientsPage() {
  const token = await getSession();
  let patients: Patient[] = [];

  if (token) {
    try {
      patients = await getPatientsList(token);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      throw error;
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Pacientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Administre la información y el historial básico de sus pacientes.
          </p>
        </div>
        <AddPatientButton />
      </div>

      <div className="w-full">
        <PatientsTable data={patients} />
      </div>
    </div>
  );
}
