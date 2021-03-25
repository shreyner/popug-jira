import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';
import { MessageBusProvider } from '../message-bus/message-bus.provider';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MessageBusProvider)
    private readonly mb: MessageBusProvider,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

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

    this.mb.sendEvent('user-stream', 'UserUpdated', {
      email: user.email,
      publicId: user.publicId,
      role: user.role,
    });

    return user.toJSON();
  }
}
