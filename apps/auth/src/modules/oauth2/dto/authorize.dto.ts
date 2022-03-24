import { Equals, IsDefined, IsOptional, IsString } from 'class-validator';

export class AuthorizeDto {
  @Equals('code')
  @IsDefined()
  @IsString()
  response_type: string;

  @IsDefined()
  @IsString() //TODO: Add validate uri
  redirect_uri: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsDefined()
  @IsString()
  client_id: string;
}
