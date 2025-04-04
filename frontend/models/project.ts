export type Project = {
    id: number;
    name: string;
    url: string;
    icon: React.ComponentType;
    target?: string;
    isActive: boolean;
    isEnabled: boolean;
};
