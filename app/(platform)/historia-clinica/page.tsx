import { redirect } from "next/navigation";
import { Plus, ClipboardList } from "lucide-react";
import { getSession } from "@/lib/actions/auth.actions";
import { getMedicalRecordsList } from "@/lib/services/medical-record";
import { MedicalRecord } from "@/types/medical-record";
import { MedicalRecordsTable } from "@/components/medical-records/medical-records-table";
import { MedicalRecordNewDialog } from "@/components/medical-records/medical-record-new-dialog";

export const metadata = {
  title: "Historia Clínica | Davos Salud",
  description: "Gestión de historias clínicas y consultas médicas",
};

export default async function MedicalRecordsPage() {
  const token = await getSession();
  if (!token) redirect("/login");

  let records: MedicalRecord[] = [];
  try {
    records = await getMedicalRecordsList(token);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Historia Clínica</h1>
            <p className="text-muted-foreground text-sm">
              {records.length} consulta{records.length !== 1 ? "s" : ""} registrada
              {records.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <MedicalRecordNewDialog />
      </div>

      {/* Tabla */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <MedicalRecordsTable data={records} />
      </div>
    </div>
  );
}
