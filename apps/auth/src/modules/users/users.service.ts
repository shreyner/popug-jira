import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import schemaEventUserRegistered from '@app/event-schemas/auth/be/user-registered/1.json';
import schemaEventUserCreated from '@app/event-schemas/auth/cud/user-created/1.json';
import schemaEventUserRoleChanged from '@app/event-schemas/auth/be/user-role-changed/1.json';
import schemaEventUserUpdate from '@app/event-schemas/auth/cud/user-updated/1.json';
import { User } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';
import { MessageBusProvider } from '../message-bus/message-bus.provider';
import { UserRole } from './enum/user-role';

type EventUserCUD = BaseEvent<
  'UserCreated' | 'UserUpdated' | 'UserDeleted',
  Pick<User, 'publicId' | 'email' | 'role'>
>;

type EventUserRoleChanged = BaseEvent<
  'UserRoleChanged',
  Pick<User, 'publicId' | 'role'>
>;

type EventUserRegistered = BaseEvent<
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

    // TODO: Выглядет как очень не надежно. Что делать в случае сохранения пользователя, но валидация event'а не прошла
    await this.userRepository.persistAndFlush(user);

    this.mb.sendEvent<EventUserRegistered>(
      'user',
      'UserRegistered',
      {
        publicId: user.publicId,
        email: user.email,
        role: user.role,
      },
      schemaEventUserRegistered,
    );

    this.mb.sendEvent<EventUserCUD>(
      'user-stream',
      'UserCreated',
      {
        publicId: user.publicId,
        email: user.email,
        role: user.role,
      },
      schemaEventUserCreated,
    );

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

    this.mb.sendEvent<EventUserRoleChanged>(
      'user',
      'UserRoleChanged',
      {
        publicId: user.publicId,
        role: user.role,
      },
      schemaEventUserRoleChanged,
    );

    this.mb.sendEvent<EventUserCUD>(
      'user-stream',
      'UserUpdated',
      {
        publicId: user.publicId,
        role: user.role,
        email: user.email,
      },
      schemaEventUserUpdate,
    );

    return user;
  }

  async update(updateUser: Partial<User> & Pick<User, 'id'>): Promise<User> {
    const user = await this.userRepository.update(updateUser);

    this.mb.sendEvent<EventUserCUD>(
      'user-stream',
      'UserUpdated',
      {
        email: user.email,
        publicId: user.publicId,
        role: user.role,
      },
      schemaEventUserUpdate,
    );

    return user;
  }
}
