import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserInterface } from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserInterface, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
