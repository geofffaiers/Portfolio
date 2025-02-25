import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";
import { Project } from "./project";

export class ConfigResponse {
    @IsBoolean()
    @Expose({ name: 'projects' })
    projects: Project[] = [];
}
