"use client"

import { AppSidebar } from "@/features/nav/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Details } from "./details"
import { Section } from "./section"
import { Footer } from "./footer"
import { cv } from "./cv"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useMemo } from "react"

export default function Page() {
  const { user } = useAuthContext()
  const isLoggedIn = useMemo(() => !!user, [user])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Hire Me</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Details isLoggedIn={isLoggedIn}/>
          {cv.map((section, index) => (
            <Section section={section} key={index}/>
          ))}
        </div>
        <Footer isLoggedIn={isLoggedIn}/>
      </SidebarInset>
    </SidebarProvider>
  )
}
