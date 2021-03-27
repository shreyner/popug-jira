import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';
import { MessageBusProvider } from '../message-bus/message-bus.provider';
import { Event } from '../message-bus/event.type';
import { UserRole } from './enum/user-role';

type EventUserCUD = Event<
  'UserCreated' | 'UserUpdated' | 'UserDeleted',
  Pick<User, 'publicId' | 'email' | 'role'>
>;

type EventUserRoleChanged = Event<
  'UserRoleChanged',
  Pick<User, 'publicId' | 'role'>
>;

type EventUserRegistered = Event<
  'UserRegistered',
  Pick<User, 'publicId' | 'role' | 'email'>
>;

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
    role,
  }: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    const user = await this.userRepository.create({ email, role });

    user.password = password;

    await this.userRepository.persistAndFlush(user);

    this.mb.sendEvent<EventUserRegistered>('user', 'UserRegistered', {
      publicId: user.publicId,
      email: user.email,
      role: user.role,
    });

    this.mb.sendEvent<EventUserCUD>('user-stream', 'UserCreated', {
      publicId: user.publicId,
      email: user.email,
      role: user.role,
    });

    return user;
  }

  async changeRole(
    actionUser: User,
    targetUserId: number,
    role: UserRole,
  ): Promise<User> {
    if (actionUser.role !== UserRole.Admin) {
      throw new ForbiddenException("You don't change role");
    }

    const user = await this.userRepository.update({ id: targetUserId, role });

    this.mb.sendEvent<EventUserRoleChanged>('user', 'UserRoleChanged', {
      publicId: user.publicId,
      role: user.role,
    });

    this.mb.sendEvent<EventUserCUD>('user-stream', 'UserUpdated', {
      publicId: user.publicId,
      role: user.role,
      email: user.email,
    });

    return user;
  }

  async update(updateUser: Partial<User> & Pick<User, 'id'>): Promise<User> {
    const user = await this.userRepository.update(updateUser);

    this.mb.sendEvent<EventUserCUD>('user-stream', 'UserUpdated', {
      email: user.email,
      publicId: user.publicId,
      role: user.role,
    });

    return user;
  }
}
