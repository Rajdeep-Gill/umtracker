"use client";

import { Folder, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function NavCourses() {
  const pathname = usePathname();
  const activeItem = pathname;
  // TODO: Fetch courses from database
  const projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[] = [
    {
      name: "Course 1",
      url: "/courses/1",
      icon: Folder,
    },
    {
      name: "Course 2",
      url: "/courses/2",
      icon: Folder,
    },
    {
      name: "Course 3",
      url: "/courses/3",
      icon: Folder,
    },
  ];
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Courses</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={cn(activeItem === item.url && "bg-accent")}
          >
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
