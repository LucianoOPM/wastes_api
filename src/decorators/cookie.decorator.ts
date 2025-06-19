import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext): string | Record<string, string> => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const cookieData = request.cookies?.[data] as string;
  const cookieObj = request.cookies as Record<string, string>;
  return data ? cookieData : cookieObj;
});
