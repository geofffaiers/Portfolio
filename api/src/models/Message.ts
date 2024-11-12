import { Expose, Transform, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator"

export class Message {
  @IsNumber()
  @Expose({ name: 'id' })
  id: number = 0

  @IsNumber()
  @Expose({ name: 'senderId' })
  @Transform(({ value, obj }) => value ?? obj.sender_id, { toClassOnly: true })
  senderId: number = 0

  @IsNumber()
  @Expose({ name: 'receiverId' })
  @Transform(({ value, obj }) => value ?? obj.receiver_id, { toClassOnly: true })
  receiverId: number = 0

  @IsString()
  @Expose({ name: 'content' })
  content: string = ''
  
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.created_at, { toClassOnly: true })
  @Expose({ name: 'createdAt' })
  createdAt?: Date = new Date()
  
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.read_at, { toClassOnly: true })
  @Expose({ name: 'readAt' })
  readAt?: Date = new Date()
}
