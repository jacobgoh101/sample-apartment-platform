import { IsDefined, IsString } from 'class-validator';

export class FacebookLoginDto {
  @IsString()
  @IsDefined()
  accessToken: string;
}
