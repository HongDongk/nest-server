/**
 * 로깅 미들웨어 — 요청이 컨트롤러에 도착하기 "전에" 실행되는 함수.
 * 들어온 요청의 메서드·주소를 찍고, 응답이 끝나면 상태코드와 걸린 시간까지 로그로 남긴다.
 * 등록은 AppModule의 configure()에서 한다.
 */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable() // 클래스형 미들웨어는 Provider처럼 DI(주입)를 받을 수 있다
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    // 응답이 다 나간 뒤(finish)에 결과 로그
    res.on('finish', () => {
      const ms = Date.now() - start;
      this.logger.log(`${method} ${originalUrl} → ${res.statusCode} (${ms}ms)`);
    });

    next(); // ⚠️ 꼭 호출해야 다음 단계(컨트롤러)로 넘어간다. 안 부르면 요청이 멈춤
  }
}
