import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './modules/auth/guard/authenticated.guard';
import { User } from './common/user.decorator';
import { AuthExceptionFilter } from './modules/auth/filter/auth-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseFilters(AuthExceptionFilter)
  @UseGuards(AuthenticatedGuard)
  @Get('/check')
  checkAuth(@User() user) {
    console.log(user);

    return true;
  }
}
