import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor(configService: ConfigService) {
    const secretKey = configService.get<string>('jwt.accessSecret');

    if (!secretKey) {
      throw new Error('No secret key provided in access token');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    });
  }

  validate(payload: { sub?: number; email?: string; userName?: number }) {
    return {
      idUser: payload.sub,
      email: payload.email,
      userName: payload.userName,
    };
  }
}
