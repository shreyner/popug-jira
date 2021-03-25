import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role'; // FIXME:
import { Event } from '../../../../auth/src/modules/message-bus/event.type';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities'; // FIXME:

type EventUserCUD = Event<
  'UserUpdated' | 'UserCreated',
  { publicId: string; email: string; role: UserRole }
>;

type EventUserRoleUpdate = Event<
  'UserRoleChanged',
  { publicId: string; role: UserRole }
>;

@Injectable()
export class UsersConsumer {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async handleEvent(event: EventUserCUD | EventUserRoleUpdate) {
    console.log('Consume event', event);
    switch (event.eventName) {
      case 'UserCreated':
        await this.userRepository.addUser(event.data);
        break;
      case 'UserRoleChanged':
      case 'UserUpdated':
        await this.userRepository.updateByPublicId(event.data);
        break;
      default:
        // TODO: I don't know
        console.log('Not handled event', event);
        throw new Error('Event not consumed');
    }
  }
}
