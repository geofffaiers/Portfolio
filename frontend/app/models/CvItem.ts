import { Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

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
  @IsString()
  @Expose({ name: 'description' })
  description?: string
}
