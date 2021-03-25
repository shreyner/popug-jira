import { UserRole } from '../enum/user-role';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UserChangeRole {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
