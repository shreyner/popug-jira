import { Injectable } from '@nestjs/common';
import { UserInterface } from './user.interface';

const users: readonly UserInterface[] = [
  {
    id: '1',
    email: 'a@b.c',
    password: '1',
    role: 'user',
  },
];

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<UserInterface | null> {
    return Promise.resolve().then(() =>
      users.find((user) => user.email === email),
    );
  }
}
