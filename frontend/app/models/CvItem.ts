import { Expose } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class CvItem {
  @IsOptional()
  @IsString()
  @Expose({ name: 'company' })
  company?: string

  @IsOptional()
  @IsString()
  @Expose({ name: 'role' })
  role?: string

  @IsOptional()
  @IsString()
  @Expose({ name: 'duration' })
  duration?: string

  @IsOptional()
  @IsDate()
  @Expose({ name: 'startDate' })
  startDate?: Date
  
  @IsOptional()
  @IsDate()
  @Expose({ name: 'endDate' })
  endDate?: Date | null

  @IsOptional()
  @IsString()
  @Expose({ name: 'description' })
  description?: string
}
