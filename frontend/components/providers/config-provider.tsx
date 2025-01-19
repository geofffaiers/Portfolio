"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import {
  ArrowBigUpDash,
  CaseUpper,
  FileUser,
  House,
  Library,
  PencilRuler,
  Spade,
} from "lucide-react"

export type Config = {
  hireMeEnabled: boolean
  reactionsEnabled: boolean
  planningPokerEnabled: boolean
  storybookEnabled: boolean
  apiDocsEnabled: boolean
  apiUrl: string
  wsUrl: string
  projects: Project[]
}

export type Project = {
  name: string
  url: string
  icon: React.ComponentType
  target?: string
  isActive: boolean
}

const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API_URL ?? "/api"
  }
  return "/api"
}

const getWsUrl = (): string => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_WS_URL ?? "/api/ws"
  }
  return "/api/ws"
}

// This is sample data.
const projects: Project[] = [
  {
    name: "Home",
    url: "/",
    icon: House,
    isActive: false,
  },
  {
    name: "Hire Me",
    url: "/hire-me",
    icon: FileUser,
    isActive: false,
  },
  {
    name: "Planning Poker",
    url: "/planning-poker",
    icon: Spade,
    isActive: false
  },
  {
    name: "Reactions",
    url: "/reactions",
    icon: ArrowBigUpDash,
    isActive: false,
  },
  {
    name: "Hangman",
    url: "/hangman",
    icon: CaseUpper,
    isActive: false,
  },
  {
    name: "Storybook",
    url: "https://www.gfaiers.com/storybook",
    icon: Library,
    target: "_blank",
    isActive: false,
  },
  {
    name: "API Docs",
    url: "https://www.gfaiers.com/api-docs",
    icon: PencilRuler,
    target: "_blank",
    isActive: false,
  },
]

const defaultConfig: Config = {
  hireMeEnabled: true,
  reactionsEnabled: true,
  planningPokerEnabled: false,
  storybookEnabled: true,
  apiDocsEnabled: true,
  apiUrl: getApiUrl(),
  wsUrl: getWsUrl(),
  projects
}

type ConfigContextProps = {
  config: Config;
  setConfig: (config: Config) => void;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined)

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config>(defaultConfig)
  
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfigContext = () => {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error("useConfigContext must be used within a ConfigProvider")
  }
  return context
}
