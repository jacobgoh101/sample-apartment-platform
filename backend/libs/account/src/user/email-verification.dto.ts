import { IsString, IsDefined, IsNumber, Min, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsDefined()
  token: string;

  @IsNumber()
  @Min(1)
  @IsDefined()
  userId: number;
}

export class CreateEmailVerificationDto {
  @IsString()
  @IsEmail()
  email: string;
}
