import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const reg = ctx.switchToHttp().getRequest();
    return reg.user;
  },
);
