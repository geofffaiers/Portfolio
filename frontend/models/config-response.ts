import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { Project } from './project';

export class ConfigResponse {
    @IsArray()
    @Expose({ name: 'projects' })
        projects: Project[] = [];
}
