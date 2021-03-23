import { Controller, Get, UseGuards } from '@nestjs/common';
import { Dictionary, wrap } from '@mikro-orm/core';
import { User } from '../../entities';
import { User as UserDecorator } from '../../common/user.decorator';
import { HasBearerAuthGuard } from '../auth/guard/has-bearer-auth.guard';

@Controller('profiles')
export class ProfilesController {
  @UseGuards(HasBearerAuthGuard)
  @Get('me')
  async me(@UserDecorator() user: User): Promise<Dictionary> {
    return wrap(user).toJSON();
  }
}
