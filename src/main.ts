import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appVersion = configService.get<string>('apiVersion')!;
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appVersion,
  });
  app.setGlobalPrefix('api');
  const port = configService.get<number>('PORT')!;

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}/api/v${appVersion}/`);
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
