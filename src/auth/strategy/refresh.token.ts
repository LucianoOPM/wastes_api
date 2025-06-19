import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { type UUID } from 'node:crypto';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(protected readonly configService: ConfigService) {
    const refreshSecret = configService.get<string>('jwt.refreshSecret');

    if (!refreshSecret) {
      throw new Error('No refresh secret key provided');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          return typeof req?.cookies?.refreshToken === 'string' ? req.cookies.refreshToken : null;
        },
      ]),
      secretOrKey: refreshSecret,
      ignoreExpiration: false,
    });
  }
  validate(payload: { sub?: number; tokenId?: UUID }) {
    return {
      userId: payload.sub,
      tokenId: payload.tokenId,
    };
  }
}
