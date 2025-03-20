import { Expose } from 'class-transformer';
import { Project } from '../project';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigResponse {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Project)
    @Expose({ name: 'projects' })
        projects: Project[] = [];
}
