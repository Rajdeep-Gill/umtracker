"use client";

import * as React from "react";
import { LayoutDashboardIcon, ListIcon, Loader2 } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { NavCourses } from "./nav-courses";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCheckSync } from "@/features/sync/use-check-sync";
import { useUpdateSync } from "@/features/sync/use-update-sync";
import { toast } from "sonner";

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "To-Do List",
      url: "/todo",
      icon: ListIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading } = useCheckSync();
  const mutation = useUpdateSync();

  const handleRefreshCalendar = () => {
    // once the data is fetched we can use the mutation
    if (!data || !data.url) {
      toast.error("No calendar link found");
      return;
    }
    setIsRefreshing(true);
    mutation.mutate(
      {
        url: data.url,
      },
      {
        onSuccess: () => {
          setIsRefreshing(false);
          toast.success("Calendar refreshed");
        },
        onError: () => {
          setIsRefreshing(false);
          toast.error("Failed to refresh calendar");
        },
      }
    );
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer"
            >
              <Link href="/">
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                <span className="text-xl font-semibold">UM-Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navData.navMain} activeItem={pathname} />
        <NavCourses />
        <Button
          className="w-fit mx-auto "
          size="sm"
          onClick={handleRefreshCalendar}
          disabled={isLoading || isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            "Refresh Calendar"
          )}
        </Button>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
