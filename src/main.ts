/**
 * 앱의 시작점(엔트리 포인트).
 * `npm run start:dev` 하면 이 파일이 제일 먼저 실행된다.
 * 루트 모듈(AppModule)을 바탕으로 Nest 앱을 만들고, 3000번 포트에서 HTTP 요청을 받기 시작한다.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
