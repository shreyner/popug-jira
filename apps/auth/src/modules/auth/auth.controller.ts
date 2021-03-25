import * as qs from 'qs';
import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { Request as RequestType } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Redirect,
  Request,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { HasLocalAuthGuard } from './guard/has-local-auth.guard';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { User as UserDecorator } from '../../common/user.decorator';
import { AuthExceptionFilter } from './filter/auth-exception.filter';
import { User } from '../../entities';
import { RegistryUserDto } from './dto/registry-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  renderLogin() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
<form method="post">
   <label for="emailInput">Email</label>
   <input name="email" id="emailInput" type="email" required />
   <label for="passwordInput">Password</label>
   <input name="password" id="passwordInput" type="password" required />
   <button type="submit">sing in</button>
</form>
</body>
</html>
    `;
  }

  @Redirect('/')
  @UseGuards(HasLocalAuthGuard)
  @Post('login')
  async login(@Query() query: Record<string, unknown>) {
    if (query.redirect_to) {
      //TODO: Надо добавить прверку на domain
      const { redirect_to, ...otherQuery } = query;

      return { url: `${redirect_to}?${qs.stringify(otherQuery)}` };
    }

    return { url: '/' };
  }

  @Post('registry')
  async registry(
    @Request() req: RequestType,
    @Body() registryUserDto: RegistryUserDto,
  ) {
    try {
      const user = await this.userService.createUser(registryUserDto);

      return user.toJSON();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException('Email is already');
      }

      throw error;
    }
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(AuthExceptionFilter)
  @Get('check')
  async checkUserAndCounter(@UserDecorator() user: User, @Session() session) {
    if (isNil(session.counter)) {
      session.counter = 1;
    } else {
      session.counter += 1;
    }

    const { counter } = session;

    return {
      user: wrap(user).toJSON(),
      counter,
    };
  }
}
