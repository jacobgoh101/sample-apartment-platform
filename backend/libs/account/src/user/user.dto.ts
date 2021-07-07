import { UserModel } from './user.model';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsDefined,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  @IsDefined()
  name: string;

  @IsString()
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  @IsDefined()
  password: string;
}

export class SignupEventDto {
  user: UserModel;
}

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
