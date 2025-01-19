"use client"

import { AppSidebar } from "@/features/nav/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useValidate } from "./use-validate"

export default function Page() {
  const { validateToken } = useParams()
  const token = Array.isArray(validateToken) ? validateToken[0] : validateToken
  const { error } = useValidate({ validateToken: token as string })
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
                  <BreadcrumbPage>Validate Email Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {error !== '' ? (
            <>
              <h1 className="text-4xl font-bold">Validate email error</h1>
              <p>{error}</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold">Validate email account</h1>
              <Loader2 className="w-10 h-10 animate-spin" />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
