import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export default JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => {
    const jwtSecret = configService.get<string>('jwt.accessToken');
    if (!jwtSecret) {
      throw new Error('No access token provided in jwt');
    }
    const accessExpiration = configService.get<string>('jwt.accessExpiration');
    if (!accessExpiration) {
      throw new Error('No access expiration time provided');
    }
    return {
      secret: jwtSecret,
      signOptions: {
        expiresIn: accessExpiration,
        algorithm: 'HS256',
      },
    };
  },
  inject: [ConfigService],
});
