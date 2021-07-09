import { IsString, IsDefined, IsNumber, Min } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsDefined()
  token: string;

  @IsNumber()
  @Min(1)
  @IsDefined()
  userId: number;
}
