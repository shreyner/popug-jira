import * as crypto from 'crypto';
import {
  Inject,
  Injectable,
  NotFoundException,
  MethodNotAllowedException,
  ForbiddenException,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { AccessToken, Client, RefreshToken, User } from '../../entities';
import { AuthorizationCodeService } from './authorization-code/authorization-code.service';
import { ClientsService } from '../clients/clients.service';
import { ResponseExchageCodeInterface } from './interface/response-exchage-code.interface';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class Oauth2Service {
  constructor(
    @Inject(AuthorizationCodeService)
    private readonly authorizationCodeService: AuthorizationCodeService,
    @Inject(ClientsService)
    private readonly clientsService: ClientsService,
    @Inject(UsersService)
    private readonly userService: UsersService,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: EntityRepository<AccessToken>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
    private readonly mikroOrmEntityManager: EntityManager,
  ) {}

  async authorize({
    user,
    clientId,
    redirectUri,
  }: {
    user: User;
    clientId: string;
    redirectUri: string;
  }) {
    const client = await this.clientsService.findByClientId(clientId);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const authorizationCode =
      await this.authorizationCodeService.createGrantCode({
        client,
        user,
        redirectUri,
      });

    return {
      code: authorizationCode.code,
      redirectUri: authorizationCode.redirectUri,
    };
  }

  async exchangeCode({
    grant_type,
    redirect_uri,
    client_id,
    client_secret,
    code,
  }: {
    grant_type: string;
    redirect_uri: string;
    client_id: string;
    client_secret: string;
    code: string;
  }): Promise<ResponseExchageCodeInterface> {
    if (grant_type !== 'authorization_code') {
      // TODO: Надо поддержать такие вещи как "password" | "clientCredentials" | "refreshToken"
      throw new MethodNotAllowedException(
        `This grant_type: ${grant_type} not allowed`,
      );
    }

    const authGrantByCode =
      await this.authorizationCodeService.getAuthGrantByCode(code);

    if (isNil(authGrantByCode)) {
      throw new ForbiddenException();
    }

    if (authGrantByCode.redirectUri !== redirect_uri) {
      throw new ForbiddenException();
    }

    const { user, client } = authGrantByCode;

    if (
      client.clientId !== client_id ||
      client.clientSecret !== client_secret
    ) {
      throw new ForbiddenException();
    }

    if (client.clientSecret && client_secret !== client.clientSecret) {
      throw new ForbiddenException();
    }

    const { refreshToken, accessToken } =
      await this.createAccessTokenAndRefreshToken({ user, client });

    return {
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
    };
  }

  async createAccessTokenAndRefreshToken({
    user,
    client,
  }: {
    user: User;
    client: Client;
  }) {
    const tokenAccess = this.generateToken();
    const tokenRefresh = this.generateToken();

    const accessToken = new AccessToken({ client, user, token: tokenAccess });
    const refreshToken = new RefreshToken({
      client,
      user,
      token: tokenRefresh,
    });

    console.log('this.mikroOrmEntityManager', this.mikroOrmEntityManager);

    await this.mikroOrmEntityManager.persistAndFlush([
      accessToken,
      refreshToken,
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateToken() {
    const randomBite = crypto.randomBytes(32);

    return Buffer.from(randomBite).toString('hex');
  }
}
