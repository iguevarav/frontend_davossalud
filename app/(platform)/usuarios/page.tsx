import { getSession, logout } from "@/lib/actions/auth.actions"
import { User } from "@/types/auth"
import { getUsers } from "@/lib/services/user"
import { AddUserButton } from "@/components/users/add-user-button"
import { UserTable } from "@/components/users/user-table"

export default async function UserPage() {
  const token = await getSession()
  let user: User[] = []

  if (token) {
    try {
      user = await getUsers(token)
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
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los usuarios del sistema.
          </p>
        </div>
        <AddUserButton />
      </div>

      <div className="w-full">
        <UserTable data={user} />
      </div>
    </div>
  )
}
