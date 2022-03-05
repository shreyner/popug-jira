import { URLSearchParams } from 'url';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Redirect,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthorizeDto } from './dto/authorize.dto';
import { Oauth2Service } from './oauth2.service';
import { User } from '../../common/decorators/user.decorator';
import { UsersService } from '../users/users.service';
import { ResponseExchageCodeInterface } from './interface/response-exchage-code.interface';
import { ExchangeCodeDto } from './dto/exchange-code.dto';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { AuthExceptionFilter } from '../auth/filter/auth-exception.filter';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    @Inject(Oauth2Service)
    private readonly oAuth2Service: Oauth2Service,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  private object2SearchParams(obj): string {
    return new URLSearchParams(obj).toString();
  }

  @Redirect()
  @UseGuards(AuthenticatedGuard)
  @UseFilters(AuthExceptionFilter)
  @Get('authorize')
  async authorize(
    @Query() { client_id, redirect_uri, state }: AuthorizeDto,
    @User() user,
  ) {
    const { code, redirectUri } = await this.oAuth2Service.authorize({
      user,
      clientId: client_id,
      redirectUri: redirect_uri,
    });

    let searchParams: Record<string, any> = {
      code,
    };

    if (state) {
      searchParams = {
        ...searchParams,
        state,
      };
    }

    return {
      url: `${redirectUri}?${this.object2SearchParams(searchParams)}`,
    };
  }

  @Post('token')
  async token(
    @Body() exchangeCodeDto: ExchangeCodeDto,
  ): Promise<ResponseExchageCodeInterface> {
    const { grant_type, code, client_secret, client_id, redirect_uri } =
      exchangeCodeDto;

    const { refresh_token, access_token } =
      await this.oAuth2Service.exchangeCode({
        grant_type,
        code,
        client_id,
        client_secret,
        redirect_uri,
      });

    return {
      access_token,
      refresh_token,
    };
  }
}
