import * as qs from 'qs';
import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { HasLocalAuthGuard } from './guard/has-local-auth.guard';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { User } from '../../common/user.decorator';
import { UserInterface } from '../users/interface/user.interface';
import { AuthExceptionFilter } from './filter/auth-exception.filter';

@Controller('auth')
export class AuthController {
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
  async login(
    @User() user: UserInterface | null,
    @Query() query: Record<string, unknown>,
  ) {
    if (query.redirect_to) {
      //TODO: Надо добавить прверку на domain
      const { redirect_to, ...otherQuery } = query;

      return { url: `${redirect_to}?${qs.stringify(otherQuery)}` };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(AuthExceptionFilter)
  @Get('check')
  async checkUserAndCounter(@User() user, @Session() session) {
    if (isNil(session.counter)) {
      session.counter = 1;
    } else {
      session.counter += 1;
    }

    const { counter } = session;

    return {
      user,
      counter,
    };
  }
}
