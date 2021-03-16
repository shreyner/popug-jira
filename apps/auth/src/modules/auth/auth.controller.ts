import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { HasLocalAuthGuard } from './guard/has-local-auth.guard';
import { HasBearerAuthGuard } from './guard/has-bearer-auth.guard';
import { User } from '../../common/user.decorator';

@Controller('auth')
export class AuthController {
  @UseGuards(HasLocalAuthGuard)
  @Post('login')
  async login(@User() user) {
    return user;
  }

  @UseGuards(HasBearerAuthGuard)
  @Get('bearer')
  async checkBearerToken(@User() user) {
    return user;
  }
}
