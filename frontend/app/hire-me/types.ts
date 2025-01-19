import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsString, ValidateNested } from "class-validator"

export class CvHeader {
  @IsString()
  @Expose({ name: "title" })
  title: string = ""

  @ValidateNested()
  @Type(() => CvItem)
  @Expose({ name: "items" })
  items: CvItem[] = []
}

export class CvItem {
  @IsOptional()
  @IsString()
  @Expose({ name: "company" })
  company?: string

  @IsOptional()
  @IsString()
  @Expose({ name: "role" })
  role?: string

  @IsOptional()
  @IsString()
  @Expose({ name: "duration" })
  duration?: string

  @IsOptional()
  @IsDate()
  @Expose({ name: "startDate" })
  startDate?: Date
  
  @IsOptional()
  @IsDate()
  @Expose({ name: "endDate" })
  endDate?: Date | null

  @IsOptional()
  @IsString()
  @Expose({ name: "description" })
  description?: string
}
