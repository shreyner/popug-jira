import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../enum/user-role';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
