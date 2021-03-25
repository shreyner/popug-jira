import { Injectable } from '@nestjs/common';
import { User } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userRepository.create({ email });

    user.password = password;

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async update(updateUser: Partial<User> & Pick<User, 'id'>): Promise<unknown> {
    const user = await this.userRepository.update(updateUser);

    return user.toJSON();
  }
}
