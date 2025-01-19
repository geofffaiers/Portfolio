import { Expose, Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class Message {
  @IsNumber()
  @Expose({ name: 'id' })
  id: number = 0

  @IsNumber()
  @Expose({ name: 'senderId' })
  senderId: number = 0

  @IsNumber()
  @Expose({ name: 'receiverId' })
  receiverId: number = 0

  @IsString()
  @Expose({ name: 'content' })
  content: string = ''

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'createdAt' })
  createdAt?: Date = new Date()

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'readAt' })
  readAt?: Date
}
