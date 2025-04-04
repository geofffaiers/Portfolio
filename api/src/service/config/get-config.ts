import { Request } from 'express';
import { ConfigResponse, DefaultResponse } from '../../models';
import { handleError } from '../../helpers';
import { Project } from '../../models/project';

export const getConfig = async (_req: Request): Promise<DefaultResponse<ConfigResponse>> => {
    try {
        const projects: Project[] = [
            {
                id: 0,
                name: 'Home',
                isEnabled: true,
            },
            {
                id: 1,
                name: 'Hire Me',
                isEnabled: false,
            },
            {
                id: 2,
                name: 'Planning Poker',
                isEnabled: true,
            },
            {
                id: 3,
                name: 'Reactions',
                isEnabled: true,
            },
            {
                id: 4,
                name: 'Hangman',
                isEnabled: true,
            },
            {
                id: 5,
                name: 'Storybook',
                isEnabled: false,
            },
            {
                id: 6,
                name: 'API Docs',
                isEnabled: true,
            },
        ];
        const configResponse: ConfigResponse = {
            projects,
        };
        return {
            success: true,
            code: 200,
            data: configResponse,
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};
