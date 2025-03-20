import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class User {
  @IsNumber()
  @Expose({ name: 'id' })
      id: number = 0;

  @IsString()
  @Expose({ name: 'username' })
      username: string = '';

  @IsString()
  @Expose({ name: 'password' })
      password: string = '';

  @IsString()
  @Expose({ name: 'email' })
      email: string = '';

  @IsOptional()
  @IsString()
  @Expose({ name: 'firstName' })
      firstName?: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'lastName' })
      lastName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'lastLogin' })
      lastLogin?: Date = new Date();

  @IsBoolean()
  @Expose({ name: 'active' })
      active: boolean = false;

  @IsOptional()
  @IsString()
  @Expose({ name: 'profilePicture' })
      profilePicture?: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'resetToken' })
      resetToken?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'resetTokenExpires' })
      resetTokenExpires?: Date = new Date();

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'createdAt' })
      createdAt?: Date = new Date();

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'updatedAt' })
      updatedAt?: Date = new Date();

  @IsBoolean()
  @Expose({ name: 'verifiedEmail' })
      verifiedEmail: boolean = false;

  @IsOptional()
  @IsString()
  @Expose({ name: 'validateToken' })
      validateToken?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'validateTokenExpires' })
      validateTokenExpires?: Date = new Date();

    constructor (user?: User) {
        if (user == null) {
            return;
        }
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.lastLogin = user.lastLogin;
        this.active = user.active;
        this.profilePicture = user.profilePicture;
        this.resetToken = user.resetToken;
        this.resetTokenExpires = user.resetTokenExpires;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.verifiedEmail = user.verifiedEmail;
        this.validateToken = user.validateToken;
        this.validateTokenExpires = user.validateTokenExpires;
    }
}
