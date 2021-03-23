import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserInterface } from '../users/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserInterface | null> {
    const user = await this.userService.findByEmail(email);

    if (user.validatePassword(password)) {
      return user;
    }

    return null;
  }
}
