import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { Oauth2Guard } from './guard/oauth2.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(Oauth2Guard)
  @Get()
  login() {
    return true;
  }

  @Redirect()
  @UseGuards(Oauth2Guard)
  @Get('callback')
  callback() {
    return { url: '/' };
  }
}
