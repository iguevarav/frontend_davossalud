import { getSession } from "@/lib/actions/auth.actions";
import { getSchedulesByStaffId } from "@/lib/services/schedules";
import { ScheduleTable } from "./schedule-table";
import { AddScheduleButton } from "./add-schedule-button";
import { Schedule } from "@/types/schedule";

export async function ScheduleSection({ staffId }: { staffId: string }) {
  const token = await getSession();
  let schedules: Schedule[] = [];

  if (token) {
    try {
      schedules = await getSchedulesByStaffId(staffId, token);
    } catch (error) {
      console.error("No se pudieron cargar los horarios", error);
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-6 w-full pl-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Registro de Turnos
          </h3>
          <p className="text-muted-foreground text-sm">
            Gestiona los horarios y la disponibilidad.
          </p>
        </div>
        <AddScheduleButton staffId={staffId} />
      </div>

      <ScheduleTable data={schedules} />
    </div>
  );
}
