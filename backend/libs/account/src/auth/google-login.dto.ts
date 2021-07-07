import { IsDefined, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsDefined()
  accessToken: string;
}
