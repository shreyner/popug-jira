import { UserRole } from '../enum/user-role';

export interface UserInterface {
  id: number;
  email: string;
  role: UserRole;
}
