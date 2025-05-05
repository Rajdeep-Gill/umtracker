"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function SiteHeader() {
  const pathname = usePathname();
  // Split pathname by "/" and remove the first element
  const pathParts = pathname.split("/").slice(1);
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathParts.map((part, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink href={`/${part}`}>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < pathParts.length - 1 && (
                  <BreadcrumbSeparator key={`separator-${index}`} />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
