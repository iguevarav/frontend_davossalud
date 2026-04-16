import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getPatientById } from "@/lib/services/patient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoveLeft,
  Mail,
  IdCard,
  Phone,
  MapPin,
  Calendar,
  HeartPulse,
  ShieldAlert,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Patient, Gender } from "@/types/patient";
import { InfoItem } from "@/components/ui/info-item";

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getSession();
  const { id } = await params;

  if (!token) return null;

  let patient: Patient;
  try {
    patient = await getPatientById(id, token);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (err.message === "UNAUTHORIZED") {
      redirect("/login");
    }
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-destructive">
          Error al cargar el perfil
        </h2>
        <p className="text-muted-foreground">{err.message}</p>
        <Button asChild variant="outline">
          <Link href="/pacientes">
            <MoveLeft className="mr-2 h-4 w-4" /> Volver a Lista
          </Link>
        </Button>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    document,
    birthDate,
    gender,
    phone,
    email,
    address,
    bloodType,
    allergies,
    chronicDiseases,
  } = patient;

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-md">
          <Link href="/pacientes">
            <MoveLeft className="h-5 w-5" />
            <span className="sr-only">Volver Atrás</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Perfil del Paciente
          </h1>
          <p className="text-muted-foreground mt-1">
            Detalle de información personal y médica.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-7xl pl-12">
        <Avatar className="h-20 w-20 shadow-sm">
          <AvatarFallback className="text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center md:items-start pt-2">
          <h2 className="text-2xl font-semibold text-foreground">
            {firstName} {lastName}
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            <Badge variant="secondary" className="p-3 text-xs">
              <span
                className={
                  gender === Gender.MALE ? "text-blue-500" : "text-pink-500"
                }
              >
                ●
              </span>
              {gender === Gender.FEMALE
                ? "Femenino"
                : gender === Gender.MALE
                  ? "Masculino"
                  : "Otro"}
            </Badge>
            {bloodType && (
              <Badge
                variant="outline"
                className="p-3 border-muted-foreground/50 text-muted-foreground"
              >
                <HeartPulse className="h-4 w-4" /> Grupo {bloodType}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 px-12 gap-12">
        <div>
          <h3 className="text-xl font-semibold text-foreground my-4">
            Información Personal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <InfoItem icon={IdCard} label="Documento" value={document} />
            <InfoItem icon={Calendar} label="F. Nacimiento" value={birthDate} />
            <InfoItem icon={Phone} label="Teléfono" value={phone} />
            <InfoItem
              icon={Mail}
              label="Correo"
              value={email || "No registrado"}
            />
            <div className="sm:col-span-2">
              <InfoItem
                icon={MapPin}
                label="Dirección"
                value={address || "No registrada"}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground my-4">
            Información Médica
          </h3>
          <div className="flex flex-col gap-2 my-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase">
              <ShieldAlert className="h-4 w-4" /> Alergias
            </div>
            <p className="text-xs bg-muted/50 p-4 rounded-md">
              {allergies || "Sin registros de alergias."}
            </p>
          </div>
          <div className="flex flex-col gap-2 my-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Activity className="h-4 w-4" /> Condiciones Crónicas
            </div>
            <p className="text-xs bg-muted/50 p-4 rounded-md">
              {chronicDiseases || "Sin registros de enfermedades crónicas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
