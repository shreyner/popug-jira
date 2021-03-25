import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role'; // FIXME:
import { Event } from '../../../../auth/src/modules/message-bus/event.type';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities'; // FIXME:

type EventUserUpdate = Event<
  'UserUpdated',
  { publicId: string; email: string; role: UserRole }
>;

@Injectable()
export class UsersConsumer {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async handleEvent(event: EventUserUpdate) {
    switch (event.eventName) {
      case 'UserUpdated':
        await this.userRepository.updateByPublicId(event.data);
        console.log('User Update', event.data);
        break;
      default:
        throw new Error('Event not consumed');
    }
  }
}
