"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  Box,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  FileText,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Stethoscope,
  Settings,
  HelpCircle,
  Building2,
  ClipboardList,
  Wallet,
  Users,
  CalendarCheck,
} from "lucide-react";

import { logout } from "@/lib/actions/auth.actions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

function DriveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d="M8.1 3h7.1l3.2 5.5h-7.1L8.1 3Z" fill="#0F9D58" />
      <path d="m5.3 8.5 3.5-5.5 3.5 5.5-3.5 6H1.8l3.5-6Z" fill="#F4B400" />
      <path d="M12.3 14.5h7l-3.5 6h-7l3.5-6Z" fill="#4285F4" />
    </svg>
  );
}

type NavItem = {
  title: string;
  url: string;
  external?: boolean;
  icon?: React.ComponentType | (() => React.JSX.Element);
};

type NavGroup = {
  title: string;
  url: string;
  icon: React.ComponentType;
  items: NavItem[];
};

const data = {
  user: {
    name: "Dr. Admin",
    email: "admin@davossalud.com",
    avatar: null,
  },
  teams: [
    {
      name: "Davos Salud",
      logo: Building2,
      plan: "Principal",
    },
  ],
  navMain: [
    {
      title: "Plataforma",
      url: "#",
      icon: LayoutDashboard,
      items: [
        { title: "Dashboard", url: "/dashboard" },
      ],
    },
    {
      title: "Clínica",
      url: "#",
      icon: Stethoscope,
      items: [
        { title: "Pacientes", url: "/pacientes" },
        { title: "Citas", url: "/citas" },
        { title: "Historia Clínica", url: "/historia-clinica", icon: ClipboardList },
        { title: "Recetas", url: "/recetas", icon: FileText },
        { title: "Tratamientos", url: "/tratamientos", icon: Sparkles },
        {
          title: "Drive",
          url: "https://drive.google.com/drive/folders/1kyn4YZLEopOBPEXnCJoCIwXueXglUJsh",
          external: true,
          icon: DriveIcon,
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      icon: Wallet,
      items: [
        { title: "Caja", url: "/caja", icon: Wallet },
        { title: "Productos", url: "/productos", icon: Box },
        { title: "Personal", url: "/personal", icon: Users },
        { title: "Usuarios", url: "/usuarios" },
      ],
    },
  ] satisfies NavGroup[],
  navSecondary: [
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Ayuda",
      url: "/help",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar() {
  const [activeTeam] = React.useState(data.teams[0]);
  const pathname = usePathname();
  const router = useRouter();
  const isGroupActive = (items: NavItem[]) =>
    items.some((item) => !item.external && pathname.startsWith(item.url));

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isGroupActive(item.items)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={!subItem.external && pathname.startsWith(subItem.url)}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (subItem.external) {
                                window.open(subItem.url, "_blank", "noopener,noreferrer");
                                return;
                              }

                              router.push(subItem.url);
                            }}
                          >
                            {subItem.icon ? <subItem.icon /> : null}
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    {data.user.avatar ? (
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    ) : null}
                    <AvatarFallback className="rounded-lg">DS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Configuración
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 size-4" />
                    Cuenta
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 size-4" />
                    Facturación
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 size-4" />
                    Notificaciones
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => await logout()}>
                  <LogOut className="mr-2 size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
