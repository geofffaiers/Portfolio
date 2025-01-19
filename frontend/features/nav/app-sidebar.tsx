"use client"

import * as React from "react"

import { NavProjects } from "@/features/nav/nav-projects"
import { NavUser } from "@/features/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderImage,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useConfigContext } from "@/components/providers/config-provider"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { config } = useConfigContext()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderImage src="/header_1_no_bg.png" alt="Geoff" />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={config.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
