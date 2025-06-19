import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appVersion = configService.get<string>('app.apiVersion')!;
  const port = configService.get<number>('app.port')!;

  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appVersion,
  });
  app.setGlobalPrefix('api');

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}/api/v${appVersion}/`);
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
