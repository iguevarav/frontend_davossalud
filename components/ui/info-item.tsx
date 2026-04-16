import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-muted rounded-md flex justify-center items-center shadow-sm text-foreground/80">
        <Icon className="h-3 w-3" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
