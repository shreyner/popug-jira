import { UserRole } from '../enum/user-role';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}
