"use client"

import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

export function useError() {
  const { toast } = useToast()

  const displayError = useCallback((message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      duration: 7000,
    })
  }, [toast])

  const displayWarning = useCallback((message: string) => {
    toast({
      title: "Warning",
      description: message,
      variant: "warning",
      duration: 7000,
    })
  }, [toast])

  return {
    displayError,
    displayWarning
  }
}