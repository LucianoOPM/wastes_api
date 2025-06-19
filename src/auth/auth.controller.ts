import { Controller, Post, Body, Headers, Ip, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { ZodValidationPipe } from '@src/zodvalidation/zodvalidation.pipe';
import { CreateSessionDto, CreateSessionSchema } from '@auth/auth.schema';
import { Request, Response } from 'express';
import { JwtRefreshAuthGuard } from '@guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(
    @Body(new ZodValidationPipe(CreateSessionSchema)) createAuthDto: CreateSessionDto,
    @Headers('User-Agent') userAgent: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.create(createAuthDto, { ip, userAgent });

    if (createAuthDto.keepSession && refreshToken) {
      res.cookie('refreshToken', refreshToken, { path: '/', sameSite: 'lax', httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    return {
      success: true,
      accessToken,
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers('User-Agent') userAgent: string,
    @Ip() ip: string,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken({ userAgent, ip }, req.user);
    res.cookie('refreshToken', refreshToken, { path: '/', sameSite: 'lax', httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return {
      success: true,
      accessToken,
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user);
    res.clearCookie('refreshToken');
    return {
      success: true,
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('revokeOthers')
  async revokeOthers(@Req() req: Request, @Headers('User-Agent') userAgent: string) {
    await this.authService.revokeOthers(userAgent, req.user);
    return {
      success: true,
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('revokeAll')
  async revokeAll(@Req() req: Request) {
    await this.authService.revokeAll(req.user);
    return {
      success: true,
    };
  }
}
