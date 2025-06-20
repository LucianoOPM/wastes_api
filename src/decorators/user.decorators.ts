import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): { idUser: number; email: string; userName: string } => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userData = request.user;
    if (!userData) throw new UnauthorizedException('You are not allowed');
    return userData as { idUser: number; email: string; userName: string };
  },
);
