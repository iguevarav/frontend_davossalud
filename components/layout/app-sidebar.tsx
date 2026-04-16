"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LayoutDashboard,
  Stethoscope,
  Settings,
  HelpCircle,
  Building2,
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

const data = {
  user: {
    name: "Dr. Admin",
    email: "admin@davossalud.com",
    avatar: "/avatars/admin.jpg",
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
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Gestión",
      url: "#",
      icon: Stethoscope,
      items: [
        {
          title: "Pacientes",
          url: "/pacientes",
        },
        {
          title: "Citas",
          url: "/citas",
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Personal",
          url: "/personal",
        },
        {
          title: "Usuarios",
          url: "/usuarios",
        },
      ],
    },
  ],
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
  const isGroupActive = (items: { url: string }[]) =>
    items.some((item) => pathname.startsWith(item.url));

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
                            asChild
                            isActive={pathname.startsWith(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
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
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
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
