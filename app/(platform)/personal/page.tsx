import { AddStaffButton } from "@/components/staff/add-staff-button"
import { StaffTable } from "@/components/staff/staff-table"
import { getStaffList } from "@/lib/services/staff"
import { getSession, logout } from "@/lib/actions/auth.actions"
import { Staff } from "@/types/staff"

export default async function StaffPage() {
  const token = await getSession()
  let staff: Staff[] = []

  if (token) {
    try {
      staff = await getStaffList(token)
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        await logout()
      }
      throw error
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los miembros del equipo.
          </p>
        </div>
        <AddStaffButton />
      </div>

      <div className="w-full">
        <StaffTable data={staff} />
      </div>
    </div>
  )
}
