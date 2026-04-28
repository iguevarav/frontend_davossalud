import { getSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { getPatientById } from "@/lib/services/patient";
import { getMedicalRecordsByPatient } from "@/lib/services/medical-record";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoveLeft,
  IdCard,
  Phone,
  MapPin,
  Calendar,
  HeartPulse,
  ShieldAlert,
  Activity,
  StickyNote,
  ClipboardList,
  FileText,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Patient, Gender } from "@/types/patient";
import { InfoItem } from "@/components/ui/info-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge as StatusBadge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return { title: "Perfil de Paciente | Davos Salud" };
}

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getSession();
  const { id } = await params;

  if (!token) redirect("/login");

  let patient: Patient;
  try {
    patient = await getPatientById(id, token);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (err.message === "UNAUTHORIZED") redirect("/login");
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

  // Historia clínica del paciente
  let medicalRecords: any[] = [];
  try {
    medicalRecords = await getMedicalRecordsByPatient(id, token);
  } catch {
    medicalRecords = [];
  }

  const {
    firstName,
    lastName,
    document,
    birthDate,
    gender,
    phone,
    address,
    additionalNote,
    bloodType,
    allergies,
    chronicDiseases,
  } = patient;

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-md">
          <Link href="/pacientes">
            <MoveLeft className="h-5 w-5" />
            <span className="sr-only">Volver Atrás</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Perfil del Paciente</h1>
          <p className="text-muted-foreground text-sm">
            Información clínica completa.
          </p>
        </div>
      </div>

      {/* Card de datos del paciente */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl border bg-card">
        <Avatar className="h-20 w-20 shadow-sm ring-2 ring-border">
          <AvatarFallback className="text-2xl font-semibold">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              <span className={gender === Gender.MALE ? "text-blue-500" : "text-pink-500"}>
                ●
              </span>
              &nbsp;
              {gender === Gender.FEMALE ? "Femenino" : gender === Gender.MALE ? "Masculino" : "Otro"}
            </Badge>
            {bloodType && (
              <Badge variant="outline" className="text-xs px-3 py-1">
                <HeartPulse className="h-3 w-3 mr-1" /> {bloodType}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-3 py-1 font-mono">
              {document}
            </Badge>
          </div>

          {/* Alertas clínicas en el header */}
          {(allergies || chronicDiseases) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {allergies && allergies.toLowerCase() !== "ninguna" && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full px-3 py-1 font-medium">
                  <ShieldAlert className="h-3 w-3" />
                  Alérgico: {allergies}
                </span>
              )}
              {chronicDiseases && chronicDiseases.toLowerCase() !== "ninguna" && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full px-3 py-1 font-medium">
                  <Activity className="h-3 w-3" />
                  {chronicDiseases}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <IdCard className="h-4 w-4" />
            <span className="hidden sm:inline">Información</span>
          </TabsTrigger>
          <TabsTrigger value="historia" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Historia Clínica</span>
            {medicalRecords.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {medicalRecords.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recetas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Recetas</span>
          </TabsTrigger>
          <TabsTrigger value="citas" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Citas</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Información Personal y Médica */}
        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className="rounded-xl border p-6 bg-card space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <IdCard className="h-4 w-4 text-primary" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem icon={IdCard} label="Documento" value={document} />
                <InfoItem icon={Calendar} label="F. Nacimiento" value={birthDate} />
                <InfoItem icon={Phone} label="Teléfono" value={phone} />
                <div className="sm:col-span-2">
                  <InfoItem icon={MapPin} label="Dirección" value={address || "No registrada"} />
                </div>
                {additionalNote && (
                  <div className="sm:col-span-2">
                    <InfoItem icon={StickyNote} label="Nota Adicional" value={additionalNote} />
                  </div>
                )}
              </div>
            </div>

            {/* Información Médica */}
            <div className="rounded-xl border p-6 bg-card space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                Alertas Clínicas
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-2">
                    <ShieldAlert className="h-4 w-4" /> Alergias
                  </div>
                  <p
                    className={`text-sm p-3 rounded-lg ${
                      allergies && allergies.toLowerCase() !== "ninguna"
                        ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-medium"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {allergies || "Sin registros de alergias."}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-2">
                    <Activity className="h-4 w-4" /> Condiciones Crónicas
                  </div>
                  <p
                    className={`text-sm p-3 rounded-lg ${
                      chronicDiseases && chronicDiseases.toLowerCase() !== "ninguna"
                        ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-medium"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {chronicDiseases || "Sin registros de enfermedades crónicas."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Historia Clínica */}
        <TabsContent value="historia" className="mt-6">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Consultas Registradas
              </h3>
              <span className="text-xs text-muted-foreground">
                {medicalRecords.length} consulta{medicalRecords.length !== 1 ? "s" : ""}
              </span>
            </div>
            {medicalRecords.length > 0 ? (
              <div className="divide-y">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-muted-foreground">
                            {record.date}
                          </span>
                          {record.cie10 && (
                            <Badge variant="outline" className="text-xs font-mono">
                              {record.cie10}
                            </Badge>
                          )}
                        </div>
                        {record.reason && (
                          <p className="text-sm font-medium">{record.reason}</p>
                        )}
                        {record.diagnosis && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {record.diagnosis}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        {record.staff?.user
                          ? `Dr. ${record.staff.user.firstName} ${record.staff.user.lastName}`
                          : ""}
                      </div>
                    </div>
                    {/* Signos vitales */}
                    {(record.weight || record.height || record.bloodPressure || record.temperature || record.heartRate) && (
                      <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-dashed">
                        {record.weight && <span className="text-xs text-muted-foreground">⚖️ {record.weight} kg</span>}
                        {record.height && <span className="text-xs text-muted-foreground">📏 {record.height} cm</span>}
                        {record.bloodPressure && <span className="text-xs text-muted-foreground">💉 {record.bloodPressure}</span>}
                        {record.temperature && <span className="text-xs text-muted-foreground">🌡️ {record.temperature}°C</span>}
                        {record.heartRate && <span className="text-xs text-muted-foreground">❤️ {record.heartRate} lpm</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
                <ClipboardList className="h-8 w-8 opacity-30" />
                <p className="text-sm">No hay consultas registradas para este paciente.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab: Recetas */}
        <TabsContent value="recetas" className="mt-6">
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2 rounded-xl border bg-card">
            <FileText className="h-8 w-8 opacity-30" />
            <p className="text-sm">
              Ver las recetas en la sección{" "}
              <Link href="/recetas" className="text-primary underline underline-offset-2">
                Recetas Médicas
              </Link>
            </p>
          </div>
        </TabsContent>

        {/* Tab: Citas */}
        <TabsContent value="citas" className="mt-6">
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2 rounded-xl border bg-card">
            <CalendarCheck className="h-8 w-8 opacity-30" />
            <p className="text-sm">
              Ver las citas en la sección{" "}
              <Link href="/citas" className="text-primary underline underline-offset-2">
                Citas
              </Link>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
