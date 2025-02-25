'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import {
    ArrowBigUpDash,
    CaseUpper,
    FileUser,
    House,
    Library,
    PencilRuler,
    Spade,
} from 'lucide-react';
import { ConfigResponse, DefaultResponse, Project } from '@/models';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';

export type Config = {
    apiUrl: string;
    wsUrl: string;
    projects: readonly Project[];
};

const getApiUrl = (): string => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_API_URL ?? '/api';
    }
    return '/api';
};

const getWsUrl = (): string => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_WS_URL ?? '/api/ws';
    }
    return '/api/ws';
};

const projects: readonly Project[] = Object.freeze([
    {
        id: 0,
        name: 'Home',
        url: '/',
        icon: House,
        isActive: false,
        isEnabled: false,
    },
    {
        id: 1,
        name: 'Hire Me',
        url: '/hire-me',
        icon: FileUser,
        isActive: false,
        isEnabled: false,
    },
    {
        id: 2,
        name: 'Planning Poker',
        url: '/planning-poker',
        icon: Spade,
        isActive: false,
        isEnabled: false,
    },
    {
        id: 3,
        name: 'Reactions',
        url: '/reactions',
        icon: ArrowBigUpDash,
        isActive: false,
        isEnabled: false,
    },
    {
        id: 4,
        name: 'Hangman',
        url: '/hangman',
        icon: CaseUpper,
        isActive: false,
        isEnabled: false,
    },
    {
        id: 5,
        name: 'Storybook',
        url: 'https://www.gfaiers.com/storybook',
        icon: Library,
        target: '_blank',
        isActive: false,
        isEnabled: false,
    },
    {
        id: 6,
        name: 'API Docs',
        url: 'https://www.gfaiers.com/api-docs',
        icon: PencilRuler,
        target: '_blank',
        isActive: false,
        isEnabled: false,
    },
]);

const defaultConfig: Config = {
    apiUrl: getApiUrl(),
    wsUrl: getWsUrl(),
    projects
};

type ConfigContextProps = {
    configLoading: boolean;
    config: Config;
    setConfig: (config: Config) => void;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const { displayError } = useToastWrapper();
    const [loading, setLoading] = useState<boolean>(true);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [config, setConfig] = useState<Config>(defaultConfig);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchConfig = useCallback(async () => {
        try {
            if (abortControllerRef.current) {
                return;
            }
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;

            const response = await fetch(`${config.apiUrl}/config`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            });
            abortControllerRef.current = null;
            const json: DefaultResponse<ConfigResponse> = await response.json();
            if (json.success && json.data != null) {
                setConfig((prevConfig) => {
                    const updatedProjects = prevConfig.projects.map((project) => {
                        const matchingProject = json.data.projects?.find(p => p.id === project.id);
                        return matchingProject ? { ...project, ...matchingProject } : project;
                    });
                    return {
                        ...prevConfig,
                        ...json.data,
                        projects: updatedProjects,
                    };
                });

            } else {
                displayError(json.message ?? 'Failed to get config');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred');
            }
        } finally {
            setLoaded(true);
            setLoading(false);
        }
    }, [config.apiUrl]);
    
    useEffect(() => {
        if (!loaded) {
            fetchConfig();
        }
    }, [loaded, fetchConfig]);

    return (
        <ConfigContext.Provider value={{ configLoading: loading, config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfigContext = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfigContext must be used within a ConfigProvider');
    }
    return context;
};
