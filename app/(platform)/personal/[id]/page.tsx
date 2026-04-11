import { getSession, logout } from "@/lib/actions/auth.actions";
import { getStaffById } from "@/lib/services/staff";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoveLeft, Mail, IdCard, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Staff } from "@/types/staff";
import { Role } from "@/types/user";
import { ScheduleSection } from "@/components/schedules/schedule-section";

export default async function PersonalProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getSession();
  const { id } = await params;

  if (!token) {
    return null;
  }

  let staff: Staff;
  try {
    staff = await getStaffById(id, token);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (err.message === "UNAUTHORIZED") {
      await logout();
    }
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-destructive">
          Error al cargar el perfil
        </h2>
        <p className="text-muted-foreground">
          {err.message || "Ocurrió un problema inesperado"}
        </p>
        <Button asChild variant="outline">
          <Link href="/personal">
            <MoveLeft className="mr-2 h-4 w-4" /> Volver
          </Link>
        </Button>
      </div>
    );
  }

  const { user, profilePhoto, specialty, document, phone, address } = staff;

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex flex-col gap-4 p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-md">
          <Link href="/personal">
            <MoveLeft className="h-5 w-5" />
            <span className="sr-only">Volver Atrás</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Perfil del Personal
          </h1>
          <p className="text-muted-foreground mt-1">Información detallada.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-7xl pt-6 pl-12">
        <Avatar className="h-20 w-20 shadow-sm">
          <AvatarImage
            src={profilePhoto || "/avatars/default.png"}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center md:items-start pt-2">
          <h2 className="text-2xl text-foreground font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            {user.roles?.map((role: Role) => (
              <Badge key={role} variant="secondary" className="p-3 text-xs">
                {role}
              </Badge>
            ))}
            {specialty && (
              <Badge
                variant="outline"
                className="p-3 border-muted-foreground/50 text-muted-foreground"
              >
                {specialty}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl h-px bg-border/60 my-2 pl-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl pl-12 my-2">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md flex justify-center items-center shadow-sm text-foreground/80">
            <Mail className="h-3 w-3" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground ">Correo Electrónico</p>
            <p className="text-sm text-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md flex justify-center items-center shadow-sm text-foreground/80">
            <IdCard className="h-3 w-3" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground ">
              Documento de Identidad
            </p>
            <p className="text-sm text-foreground">
              {document || "No registrado"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md flex justify-center items-center shadow-sm text-foreground/80">
            <Phone className="h-3 w-3" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground ">Teléfono</p>
            <p className="text-sm text-foreground">
              {phone || "No registrado"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md flex justify-center items-center shadow-sm text-foreground/80">
            <MapPin className="h-3 w-3" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground ">Dirección</p>
            <p className="text-sm text-foreground">
              {address || "No registrado"}
            </p>
          </div>
        </div>
      </div>

      <ScheduleSection staffId={staff.id} />
    </div>
  );
}
