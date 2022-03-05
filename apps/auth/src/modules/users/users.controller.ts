import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HasBearerAuthGuard } from '../auth/guard/has-bearer-auth.guard';
import { User as UserDecorator } from '../../common/decorators/user.decorator';
import { User } from '../../entities';
import { Dictionary, NotFoundError, wrap } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { AuthExceptionFilter } from '../auth/filter/auth-exception.filter';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersService } from './users.service';
import { UserChangeRole } from './dto/user-change-role';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  @UseFilters(AuthExceptionFilter)
  @UseGuards(HasBearerAuthGuard, AuthenticatedGuard)
  @Get('me')
  async me(@UserDecorator() user: User): Promise<Dictionary> {
    return wrap(user).toJSON();
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/change-role')
  async changeRole(
    @UserDecorator() user: User,
    @Param('id') id: number,
    @Body() { role }: UserChangeRole,
  ) {
    try {
      await this.userService.changeRole(user, id, role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // TODO: Вынести в Filter, там проверять ошибку
        throw new NotFoundException('User not found');
      }

      throw error;
    }
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<void> {
    try {
      await this.userService.update({ ...userUpdateDto, id });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('User not found');
      }
    }
  }
}
