import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type'; // FIXME:
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role';
import { UsersService } from './users.service'; // FIXME:

type EventUserCUD = BaseEvent<
  'UserUpdated' | 'UserCreated' | 'UserRegistered',
  { publicId: string; email: string; role: UserRole }
>;

type EventUserRoleUpdate = BaseEvent<
  'UserRoleChanged',
  { publicId: string; role: UserRole }
>;

@Injectable()
export class UsersConsumer {
  private readonly logger = new Logger(UsersConsumer.name);

  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  async handleEvent(event: EventUserCUD | EventUserRoleUpdate) {
    this.logger.log(`Consume event`);
    console.log(event);

    switch (event.eventName) {
      case 'UserRegistered':
      case 'UserCreated':
        if (event.eventVersion !== 1) {
          this.logger.error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          throw new Error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          break;
        }

        await this.usersService.addUserOrSkip(event.data);
        break;

      case 'UserRoleChanged':
      case 'UserUpdated':
        if (event.eventVersion !== 1) {
          this.logger.error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          throw new Error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          break;
        }

        await this.usersService.updateByPublicId(event.data);
        break;
      default:
        // TODO: I don't know
        this.logger.error(`Not handle event: ${(event as any).eventName}`);
        throw new Error('Event not consumed');
    }
  }
}
