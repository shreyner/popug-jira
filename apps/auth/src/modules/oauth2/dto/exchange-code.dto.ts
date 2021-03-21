import { Equals, IsDefined, IsString } from 'class-validator';

export class ExchangeCodeDto {
  @IsDefined()
  @IsString()
  @Equals('authorization_code')
  grant_type: string;

  @IsString()
  @IsDefined()
  redirect_uri: string;

  @IsString()
  @IsDefined()
  client_id: string;

  @IsString()
  @IsDefined()
  client_secret: string;

  @IsString()
  @IsDefined()
  code: string;
}
