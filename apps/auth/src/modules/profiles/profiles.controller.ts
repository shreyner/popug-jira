import omit from 'lodash/omit';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Dictionary, wrap } from '@mikro-orm/core';
import { User } from '../../entities';
import { User as UserDecorator } from '../../common/decorators/user.decorator';
import { HasBearerAuthGuard } from '../auth/guard/has-bearer-auth.guard';

@Controller('profiles')
export class ProfilesController {
  @UseGuards(HasBearerAuthGuard)
  @Get('me') //TODO: Добавить валидациюю по схеме профиля который отсылаем
  async me(@UserDecorator() user: User): Promise<Dictionary> {
    return omit(wrap(user).toJSON(), 'id');
  }
}
