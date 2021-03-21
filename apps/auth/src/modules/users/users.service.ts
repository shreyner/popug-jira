import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { UserInterface } from './interface/user.interface';
import { User } from '../../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findByEmail(email: string): Promise<UserInterface | null> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: unknown): Promise<UserInterface | null> {
    return this.userRepository.findOne({ id });
  }
}
