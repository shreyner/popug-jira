import { isNil } from '@nestjs/common/utils/shared.utils';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
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

    // const user = await this.userService.findById(userId);
    // TODO: Добавить store для User и получать его от туда или из Redis
    const user = { id: 1, email: 'al.shreyner@gmail.com' };

    if (isNil(user)) {
      return done(true);
    }

    const { ...otherFields } = user;

    return done(null, otherFields);
  }

  serializeUser(
    user: unknown,
    done: (err: unknown, result?: unknown) => void,
  ): void {
    let parseuser = user;

    if (typeof user === 'string') {
      parseuser = JSON.parse(user);
    }

    if (this.userIdGuard(parseuser)) {
      return done(undefined, parseuser.id);
    }

    return done(true);
  }
}
