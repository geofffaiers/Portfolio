import { Expose, Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'
import { CvItem } from './CvItem'

export class CvHeader {
  @IsString()
  @Expose({ name: 'title' })
  title: string = ''

  @ValidateNested()
  @Type(() => CvItem)
  @Expose({ name: 'items' })
  items: CvItem[] = []
}
