/**
 * Cats 기능 모듈 — 고양이 관련 컨트롤러와 서비스를 한 상자로 묶는다.
 * - controllers: 이 모듈의 컨트롤러
 * - providers: 이 모듈 안에서 쓰는 서비스
 * - exports: 다른 모듈(이 모듈을 import한 곳)에도 빌려줄 서비스
 * AppModule의 imports에 등록되어 있어서 앱에 포함된다.
 */
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller.js';
import { CatsService } from './cats.service.js';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // 다른 모듈에서도 쓰게 하려면
})
export class CatsModule {}
