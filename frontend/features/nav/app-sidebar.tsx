import * as React from 'react';

import { NavProjects } from '@/features/nav/nav-projects';
import { NavUser } from '@/features/nav/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarContent>
                <NavProjects />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
