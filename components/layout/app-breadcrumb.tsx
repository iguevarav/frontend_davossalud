"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DotIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const pathNames = pathname.split("/").filter((path) => path);

  const formatLabel = (text: string) => {
    if (text.length > 20 && text.includes("-")) {
      return "Detalles";
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathNames.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Inicio</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathNames.length - 1;
          const label = formatLabel(link);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator>
                <DotIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
