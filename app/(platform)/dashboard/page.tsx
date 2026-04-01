import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Nuevos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+4</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
