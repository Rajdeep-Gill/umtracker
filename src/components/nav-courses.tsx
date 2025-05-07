"use client";

import { Folder } from "lucide-react";
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
import { useGetEvents } from "@/features/events/use-get-events";

export function NavCourses() {
  const pathname = usePathname();
  const activeItem = pathname;
  const { data, isLoading } = useGetEvents();

  if (isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Courses</SidebarGroupLabel>
        <SidebarMenu>
          {[1, 2, 3].map((i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton>
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (!data?.courses.length) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Courses</SidebarGroupLabel>
      <SidebarMenu>
        {data.courses.map((course) => (
          <SidebarMenuItem
            key={course.code}
            className={cn(
              activeItem === `/courses/${course.code}` && "bg-accent"
            )}
          >
            <SidebarMenuButton asChild>
              <Link href={`/courses/${course.code}`}>
                <Folder style={{ color: course.color }} />
                <span>{course.code}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
