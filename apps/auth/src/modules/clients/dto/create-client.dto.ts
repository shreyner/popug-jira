import { IsBoolean, IsDefined, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @IsDefined()
  @IsString()
  @Length(4, 16)
  name: string;

  @IsDefined()
  @IsString() // TODO: change on validate url
  @Length(4)
  redirectUrl: string;

  @IsBoolean()
  isTrusted: boolean;
}
