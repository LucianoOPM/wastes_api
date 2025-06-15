import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT')!;

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
