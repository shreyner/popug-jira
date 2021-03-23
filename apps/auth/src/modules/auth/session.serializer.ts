import { isNil } from '@nestjs/common/utils/shared.utils';
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {
    super();
  }

  userIdGuard(user: unknown): user is { id: number } {
    return (
      typeof user === 'object' &&
      typeof (user as { id: number }).id === 'number'
    );
  }

  async deserializeUser(
    userId: unknown,
    done: (err: unknown, result?: unknown) => void,
  ): Promise<unknown> {
    if (typeof userId !== 'number') {
      return done(true, undefined);
    }

    const user = await this.userService.findById(userId);

    if (isNil(user)) {
      return done(true);
    }

    return done(null, user);
  }

  serializeUser(
    user: unknown,
    done: (err: unknown, result?: unknown) => void,
  ): void {
    if (this.userIdGuard(user)) {
      return done(undefined, user.id);
    }

    return done(true);
  }
}
