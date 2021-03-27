import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role'; // FIXME:
import { Event } from '../../../../auth/src/modules/message-bus/event.type';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities'; // FIXME:

type EventUserCUD = Event<
  'UserUpdated' | 'UserCreated' | 'UserRegistered',
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
      case 'UserRegistered':
      case 'UserCreated':
        if (event.eventVersion !== 1) {
          console.error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          throw new Error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
        }

        await this.userRepository.addUser(event.data);
        break;
      case 'UserRoleChanged':
      case 'UserUpdated':
        if (event.eventVersion !== 1) {
          console.error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          throw new Error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
        }
        await this.userRepository.updateByPublicId(event.data);
        break;
      default:
        // TODO: I don't know
        console.log('Not handled event', event);
        throw new Error('Event not consumed');
    }
  }
}
