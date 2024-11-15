import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'

export class User {
  @IsNumber()
  @Expose({ name: 'id' })
  id: number = 0

  @IsString()
  @Expose({ name: 'username' })
  username: string = ''

  @IsString()
  @Expose({ name: 'password' })
  password: string = ''

  @IsString()
  @Expose({ name: 'email' })
  email: string = ''

  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj.first_name, { toClassOnly: true })
  @Expose({ name: 'firstName' })
  firstName?: string

  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj.last_name, { toClassOnly: true })
  @Expose({ name: 'lastName' })
  lastName?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.last_login, { toClassOnly: true })
  @Expose({ name: 'lastLogin' })
  lastLogin?: Date = new Date()

  @IsBoolean()
  @Transform(({ value }) => value === 1 || value === true, { toClassOnly: true })
  @Expose({ name: 'active' })
  active: boolean = false

  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj.profile_picture, { toClassOnly: true })
  @Expose({ name: 'profilePicture' })
  profilePicture?: string

  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj.reset_token, { toClassOnly: true })
  @Expose({ name: 'resetToken' })
  resetToken?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.reset_token_expires, { toClassOnly: true })
  @Expose({ name: 'resetTokenExpires' })
  resetTokenExpires?: Date = new Date()

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.created_at, { toClassOnly: true })
  @Expose({ name: 'createdAt' })
  createdAt?: Date = new Date()

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.updated_at, { toClassOnly: true })
  @Expose({ name: 'updatedAt' })
  updatedAt?: Date = new Date()
}
