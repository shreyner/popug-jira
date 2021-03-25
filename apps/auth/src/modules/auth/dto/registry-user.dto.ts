import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistryUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 32)
  password: string;
}
