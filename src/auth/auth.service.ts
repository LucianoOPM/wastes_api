import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '@auth/auth.repository';
import { UsersService } from '@users/users.service';
import { CreateSessionDto } from '@auth/auth.schema';
import { Hash } from '@lib/hash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { addDay, isAfter, diffDays } from '@formkit/tempo';
import { randomUUID, type UUID } from 'node:crypto';

type UserMetaData = {
  ip: string;
  userAgent: string;
};

type LoginReturn = {
  accessToken: string;
  refreshToken?: string;
};

type CookieUser = {
  userId?: number;
  tokenId?: UUID;
};

@Injectable()
export class AuthService {
  constructor(
    protected readonly authRepository: AuthRepository,
    protected readonly userService: UsersService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  async create(createAuthDto: CreateSessionDto, userMetaData: UserMetaData): Promise<LoginReturn> {
    const { email, password, keepSession } = createAuthDto;
    const user = await this.userService.findByEmail(email);
    const isSamePass = await Hash.comparePassword(password, user.password);

    if (!isSamePass) throw new BadRequestException('Invalid credentials');

    const payload = {
      sub: user.idUser,
      email: user.email,
      userName: `${user.firstName} ${user.lastName}`,
    };
    const token = await this.jwtService.signAsync(payload);

    if (keepSession) {
      const idSession = randomUUID();
      const refreshPayload = { sub: user.idUser, tokenId: idSession };
      const jwtSecret = this.configService.get<string>('jwt.refreshSecret')!;
      const expirationTime = this.configService.get<string>('jwt.refreshExpiration')!;
      const expirationNumber = Number(expirationTime.replace('d', ''));
      const refreshToken = await this.jwtService.signAsync(refreshPayload, { secret: jwtSecret, expiresIn: expirationTime });
      const today = new Date();
      const expiration = addDay(today, expirationNumber);

      await this.authRepository.create({
        idSession,
        ipAdress: userMetaData.ip,
        userAgent: userMetaData.userAgent,
        userId: user.idUser,
        expiresAt: expiration,
      });

      return {
        accessToken: token,
        refreshToken,
      };
    } else {
      return { accessToken: token };
    }
  }

  async refreshToken(userMeta: UserMetaData, cookieUser?: CookieUser) {
    if (!cookieUser) throw new BadRequestException('User ID was not provided');
    if (!cookieUser.userId) throw new BadRequestException('User ID was not provided');
    if (!cookieUser.tokenId) throw new BadRequestException('Id token no provided');

    const user = await this.userService.findById(cookieUser.userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is not active');

    const session = await this.authRepository.getSession(cookieUser.userId, cookieUser.tokenId);
    const today = new Date();
    if (!session) throw new NotFoundException('Session was not found');
    if (!session.isValid) throw new BadRequestException('Actual session is not valid');
    if (session.userAgent !== userMeta.userAgent) throw new UnauthorizedException('You are not allowed to do this');
    if (isAfter(today, session.expiresAt)) throw new ForbiddenException('Session is not valid');

    const daysLeft = diffDays(session.expiresAt, today);

    const accessPayload = { sub: user.idUser, email: user.email, username: `${user.firstName} ${user.lastName}` };
    const accessToken = await this.jwtService.signAsync(accessPayload);

    if (daysLeft <= 1) {
      await this.authRepository.inactivate(cookieUser.tokenId);

      const tokenId = randomUUID();
      const refreshPayload = { sub: user.idUser, tokenId };
      const jwtSecret = this.configService.get<string>('jwt.refreshSecret')!;
      const expirationTime = this.configService.get<string>('jwt.refreshExpiration')!;
      const expirationNumber = Number(expirationTime.replace('d', ''));
      const expiration = addDay(today, expirationNumber);

      const refreshToken = await this.jwtService.signAsync(refreshPayload, { secret: jwtSecret, expiresIn: expirationTime });

      await this.authRepository.create({
        idSession: tokenId,
        ipAdress: userMeta.ip,
        userAgent: userMeta.userAgent,
        createdAt: today,
        expiresAt: expiration,
        userId: user.idUser,
      });

      return {
        accessToken,
        refreshToken,
      };
    }

    return {
      accessToken,
    };
  }

  async logout(cookieUser?: CookieUser) {
    if (!cookieUser) throw new UnauthorizedException('Invalid credentials');
    if (!cookieUser.tokenId) throw new UnauthorizedException('Invalid credentials');
    await this.authRepository.inactivate(cookieUser.tokenId);
  }

  async revokeOthers(userAgent: string, cookieUser?: CookieUser) {
    if (!cookieUser) throw new BadRequestException('Invalid credentials');
    if (!cookieUser.tokenId) throw new BadRequestException('Invalid credentials');
    if (!cookieUser.userId) throw new BadRequestException('Invalid credentials');

    const today = new Date();

    const session = await this.authRepository.getSession(cookieUser.userId, cookieUser.tokenId);

    if (!session) throw new NotFoundException('Session not found');
    if (!session.isValid) throw new BadRequestException('This session is not valid');
    if (isAfter(today, session.expiresAt)) throw new ForbiddenException('Requested token is expired');

    await this.authRepository.revokeOthers(cookieUser.userId, cookieUser.tokenId);
  }

  async revokeAll(cookieUser?: CookieUser) {
    if (!cookieUser) throw new BadRequestException('Session no provided');
    if (!cookieUser.tokenId) throw new BadRequestException('Session no provided');
    if (!cookieUser.userId) throw new BadRequestException('Session no provided');
    await this.authRepository.revokeAll(cookieUser.userId);
  }
}
