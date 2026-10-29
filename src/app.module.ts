/**
 * 루트 모듈 — 앱 전체의 '조립도'.
 * Nest는 여기서 출발해 imports를 따라가며 앱 구조를 파악한다.
 * - imports: 가져다 쓸 다른 모듈 (CatsModule 등 기능 모듈)
 * - controllers / providers: 이 모듈에 직접 속한 컨트롤러와 서비스
 * - configure(): 미들웨어를 어떤 경로에 적용할지 등록하는 곳
 * - APP_FILTER: 예외 필터를 앱 전체(전역)에 적용
 * - APP_PIPE: ValidationPipe를 앱 전체(전역)에 적용 → 모든 @Body() DTO 자동 검사
 */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CatsModule } from './cats/cats.module.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 전역 예외 필터 등록. main.ts의 app.useGlobalFilters()와 달리 DI가 가능한 방식
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // 전역 검증 파이프. DTO 클래스의 class-validator 규칙으로 요청 본문을 검사한다
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // DTO에 없는 필드는 자동으로 제거
        forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 아예 400 에러
        // transform: true 를 켜면 DTO 인스턴스 변환 + 원시값 자동 형변환까지 해준다.
        // 단, 전역 파이프가 먼저 실행돼서 "abc" → NaN 으로 바뀐 뒤 ParseIdPipe에 들어가므로 여기선 끔
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 적용할 미들웨어
      .forRoutes('*path'); // 모든 경로에 적용. 'cats'로 바꾸면 /cats 요청에만 적용
  }
}
