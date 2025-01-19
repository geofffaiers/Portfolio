"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Project } from "@/components/providers/config-provider"

export function NavProjects({
  projects,
}: {
  projects: Project[]
}) {
  const { open } = useSidebar()
  const currentPath = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = currentPath === item.url
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild
                tooltip={ open ? undefined : {
                  children: item.name,
                  hidden: false,
                }}
                isActive={isActive}
                className={"px-2.5 md:px-2"}
              >
                <Link href={item.url} target={item.target}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
