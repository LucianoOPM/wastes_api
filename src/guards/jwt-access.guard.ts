import { AuthGuard } from '@nestjs/passport';

export class JwtAccessToken extends AuthGuard('access_token') {}
