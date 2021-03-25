import { Injectable } from '@nestjs/common';
import { UserInterface } from '../users/interface/user.interface';
import { UserRepository } from '../../repositories/user.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserInterface | null> {
    const user = await this.userRepository.findByEmail(email);

    if (user.validatePassword(password)) {
      return user;
    }

    return null;
  }
}
