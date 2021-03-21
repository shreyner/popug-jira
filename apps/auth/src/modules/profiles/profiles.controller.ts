import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../../entities';
import { User as UserDecorator } from '../../common/user.decorator';
import { HasBearerAuthGuard } from '../auth/guard/has-bearer-auth.guard';

@Controller('profiles')
export class ProfilesController {
  @UseGuards(HasBearerAuthGuard)
  @Get('me')
  async me(@UserDecorator() user: User): Promise<Omit<User, 'password'>> {
    const { password, ...otherFields } = user;

    return otherFields;
  }
}
