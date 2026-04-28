import { redirect } from "next/navigation";
import {
  Users,
  CalendarCheck,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { getSession } from "@/lib/actions/auth.actions";
import { getDashboardStats } from "@/lib/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard | Davos Salud",
  description: "Panel de control del sistema de gestión clínica",
};

export default async function DashboardPage() {
  const token = await getSession();
  if (!token) redirect("/login");

  let stats = {
    totalPatients: 0,
    totalStaff: 0,
    todayAppointments: 0,
    weekAppointments: 0,
    todayIncome: 0,
    todayExpense: 0,
    todayBalance: 0,
    upcomingToday: [] as any[],
    last7Days: [] as any[],
  };

  try {
    stats = await getDashboardStats(token);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") redirect("/login");
  }

  const fmt = (n: number) =>
    `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  const statCards = [
    {
      title: "Total Pacientes",
      value: stats.totalPatients,
      icon: Users,
      sub: "Registrados en el sistema",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Personal Médico",
      value: stats.totalStaff,
      icon: Stethoscope,
      sub: "Especialistas activos",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Citas Hoy",
      value: stats.todayAppointments,
      icon: CalendarCheck,
      sub: `${stats.weekAppointments} esta semana`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Ingresos Hoy",
      value: fmt(stats.todayIncome),
      icon: TrendingUp,
      sub: `Balance: ${fmt(stats.todayBalance)}`,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
  ];

  const appointmentStatusLabels: Record<string, string> = {
    PENDING_CONFIRMATION: "Por confirmar",
    CONFIRMED: "Confirmada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistió",
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Resumen del día — {new Date().toLocaleDateString("es-PE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla de citas de hoy */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Citas de Hoy</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {stats.upcomingToday.length} cita{stats.upcomingToday.length !== 1 ? "s" : ""}
          </span>
        </div>
        {stats.upcomingToday.length > 0 ? (
          <div className="divide-y">
            {stats.upcomingToday.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-[60px] text-sm font-mono text-muted-foreground">
                  {apt.startTime || "—"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {apt.patient.firstName} {apt.patient.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {apt.staff?.user
                      ? `Dr. ${apt.staff.user.firstName} ${apt.staff.user.lastName}`
                      : "—"}{" "}
                    {apt.staff?.specialty ? `· ${apt.staff.specialty}` : ""}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    apt.status === "COMPLETED"
                      ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                      : apt.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        : apt.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                  }`}
                >
                  {appointmentStatusLabels[apt.status] || apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
            No hay citas programadas para hoy.
          </div>
        )}
      </div>

      {/* Gráfico simple de últimos 7 días */}
      {stats.last7Days.length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Citas — Últimos 7 días</h2>
          </div>
          <div className="flex items-end gap-2 px-6 py-6 h-32">
            {stats.last7Days.map((day) => {
              const maxCount = Math.max(...stats.last7Days.map((d) => d.count), 1);
              const heightPct = (day.count / maxCount) * 100;
              const label = new Date(day.date + "T12:00:00").toLocaleDateString("es-PE", {
                weekday: "short",
              });
              return (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {day.count}
                  </span>
                  <div className="w-full flex items-end h-16">
                    <div
                      className="w-full rounded-t-sm bg-primary/70 transition-all"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
